import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UserRole } from './users/user.entity';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly users: UsersService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onApplicationBootstrap() {
    // Seed admin user if it does not exist
    const email = process.env.ADMIN_EMAIL ?? 'admin@industriasp.local';
    const password = process.env.ADMIN_PASSWORD ?? 'admin123';
    const existing = await this.users.findByEmail(email);
    if (!existing) {
      await this.users.create({ email, password, role: UserRole.ADMIN, fullName: 'Administrador' });
      this.logger.log(`Usuario admin creado: ${email}`);
    } else {
      this.logger.log(`Usuario admin existente: ${email}`);
    }
  }
}
