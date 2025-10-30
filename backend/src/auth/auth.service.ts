import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  // Protección básica contra fuerza bruta: intentos por email
  private loginAttempts: Map<string, { count: number; firstAttemptAt: number; blockedUntil?: number }> = new Map();

  private checkBruteForce(email: string) {
    const now = Date.now();
    const record = this.loginAttempts.get(email);
    if (record?.blockedUntil && now < record.blockedUntil) {
      throw new UnauthorizedException('Demasiados intentos. Intente más tarde.');
    }
  }

  private registerFailedAttempt(email: string) {
    const now = Date.now();
    const record = this.loginAttempts.get(email);
    if (!record) {
      this.loginAttempts.set(email, { count: 1, firstAttemptAt: now });
      return;
    }
    // ventana de 10 minutos
    const windowMs = 10 * 60 * 1000;
    if (now - record.firstAttemptAt > windowMs) {
      this.loginAttempts.set(email, { count: 1, firstAttemptAt: now });
      return;
    }
    record.count += 1;
    // bloquear por 15 minutos si supera 5 intentos
    if (record.count >= 5) {
      record.blockedUntil = now + 15 * 60 * 1000;
    }
    this.loginAttempts.set(email, record);
  }

  private resetAttempts(email: string) {
    this.loginAttempts.delete(email);
  }

  async register(data: { email: string; password: string; fullName?: string }) {
    const existing = await this.users.findByEmail(data.email);
    if (existing) throw new UnauthorizedException('Email ya registrado');
    const user = await this.users.create(data);
    // Generar token de verificación
    const verificationToken = randomBytes(16).toString('hex');
    await this.users.update(user.id, { verificationToken });
    // En un entorno real, enviar email de verificación aquí
    return { ...this.signUser(user.id, user.email, user.role), verificationToken };
  }

  async login(data: { email: string; password: string }) {
    this.checkBruteForce(data.email);
    const user = await this.users.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) {
      this.registerFailedAttempt(data.email);
      throw new UnauthorizedException('Credenciales inválidas');
    }
    this.resetAttempts(data.email);
    return this.signUser(user.id, user.email, user.role);
  }

  private signUser(id: number, email: string, role: any) {
    const payload = { sub: id, email, role };
    const token = this.jwt.sign(payload);
    return { access_token: token, user: { id, email, role } };
  }

  async forgotPassword(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new BadRequestException('Usuario no encontrado');
    const token = randomBytes(16).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await this.users.update(user.id, { resetToken: token, resetTokenExpires: expires });
    // Enviar email en entorno real; por ahora devolver token para desarrollo
    return { sent: true, token };
  }

  async resetPassword(token: string, newPassword: string) {
    const all = await this.users.findAll();
    const user = all.find(u => (u as any).resetToken === token);
    if (!user) throw new BadRequestException('Token inválido');
    if (user.resetTokenExpires && new Date(user.resetTokenExpires).getTime() < Date.now()) {
      throw new BadRequestException('Token expirado');
    }
    await this.users.update(user.id, { password: newPassword, resetToken: null, resetTokenExpires: null } as any);
    return { reset: true };
  }

  async sendVerification(userId: number) {
    const token = randomBytes(16).toString('hex');
    await this.users.update(userId, { verificationToken: token });
    return { sent: true, token };
  }

  async verifyEmail(token: string) {
    const all = await this.users.findAll();
    const user = all.find(u => (u as any).verificationToken === token);
    if (!user) throw new BadRequestException('Token inválido');
    await this.users.update(user.id, { verified: true, verificationToken: null } as any);
    return { verified: true };
  }
}
