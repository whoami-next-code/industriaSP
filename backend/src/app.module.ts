import { Module } from '@nestjs/common';
import { ReportesModule } from './reportes/reportes.module';
import { ContactosModule } from './contactos/contactos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ComprasModule } from './compras/compras.module';
import { PagosModule } from './pagos/pagos.module';
import { ComprobantesModule } from './comprobantes/comprobantes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    ServeStaticModule.forRoot({ rootPath: join(process.cwd(), 'public'), serveRoot: '/' }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const dbType = (process.env.DB_TYPE ?? 'mysql').toLowerCase();
        if (dbType === 'sqlite') {
          return {
            type: 'sqlite' as const,
            database: process.env.DB_SQLITE_PATH ?? 'dev.sqlite',
            autoLoadEntities: true,
            synchronize: true,
          };
        }
        // default: mysql
        return {
          type: 'mysql' as const,
          host: process.env.DB_HOST ?? 'localhost',
          port: Number(process.env.DB_PORT ?? 3306),
          username: process.env.DB_USER ?? 'root',
          password: process.env.DB_PASS ?? '',
          database: process.env.DB_NAME ?? 'industriassp',
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    ProductosModule,
    CategoriasModule,
    CotizacionesModule,
    PedidosModule,
    ComprasModule,
    PagosModule,
    ComprobantesModule,
    ContactosModule,
    ReportesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
