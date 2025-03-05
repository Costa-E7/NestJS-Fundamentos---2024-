import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';

  @Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      ThrottlerModule.forRoot([{ ttl: 180000, limit: 10 }]),
      forwardRef(() => UserModule),
      forwardRef(() => AuthModule),
      MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: {
            host: configService.get('EMAIL_HOST'),
            port: configService.get('EMAIL_PORT'),
            auth: {
              user: configService.get('EMAIL_USER'),
              pass: configService.get('EMAIL_PASS'),
            },
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        }),
        inject: [ConfigService],
      }),
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_DATABASE || 'test',
        entities: [User], // Ou use um glob pattern como 'dist/**/*.entity.js'
        synchronize: process.env.NODE_ENV === 'dev',
      }),
    ],

    controllers: [AppController],
    providers: [
      AppService,
      {
        provide: APP_GUARD,
        useClass: ThrottlerGuard,
      },
    ],
    exports: [AppService],
  })
export class AppModule {}
