import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer'; // Não há necessidade de importar o PugAdapter se não for usá-lo
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

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
