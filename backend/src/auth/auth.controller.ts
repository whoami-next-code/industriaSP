import { Controller, Post, Body, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly users: UsersService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; fullName?: string }) {
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: any) {
    return req.user;
  }

  // Recuperación de contraseña
  @Post('forgot-password')
  async forgot(@Body() body: { email: string }) {
    return this.auth.forgotPassword(body.email);
  }

  @Post('reset-password')
  async reset(@Body() body: { token: string; newPassword: string }) {
    return this.auth.resetPassword(body.token, body.newPassword);
  }

  // Verificación de email
  @Post('send-verification')
  @UseGuards(JwtAuthGuard)
  async sendVerification(@Req() req: any) {
    return this.auth.sendVerification(req.user.userId);
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    return this.auth.verifyEmail(token);
  }

  // Desarrollo: endpoint para forzar la creación del usuario admin si no existe
  @Post('dev-seed-admin')
  async devSeedAdmin() {
    const email = process.env.ADMIN_EMAIL ?? 'admin@industriasp.local';
    const password = process.env.ADMIN_PASSWORD ?? 'admin123';
    const existing = await this.users.findByEmail(email);
    if (!existing) {
      await this.users.create({ email, password, role: UserRole.ADMIN, fullName: 'Administrador' });
      return { seeded: true, email };
    }
    return { seeded: false, email };
  }

  // Desarrollo: restablecer contraseña del admin según ADMIN_PASSWORD
  @Post('dev-reset-admin')
  async devResetAdmin() {
    const email = process.env.ADMIN_EMAIL ?? 'admin@industriasp.local';
    const password = process.env.ADMIN_PASSWORD ?? 'admin123';
    const existing = await this.users.findByEmail(email);
    if (!existing) return { reset: false, error: 'admin_not_found', email };
    await this.users.update(existing.id, { password } as any);
    return { reset: true, email };
  }
}
