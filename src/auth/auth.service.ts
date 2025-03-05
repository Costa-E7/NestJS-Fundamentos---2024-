import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDTO } from 'src/user/dto/auth-login.dto';
import { AuthRegisterDTO } from 'src/user/dto/auth-register.dto';
import { AuthResetDTO } from 'src/user/dto/auth-reset.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { link } from 'fs';
import { User } from 'src/user/entity/user.entity';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtSerrvice: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService
  ) { }

  async createToken(user: User) {
    return {
      acessToken: this.jwtSerrvice.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '60 days',
          subject: String(user.id),
          issuer: 'login',
          audience: 'users',
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      return this.jwtSerrvice.verify(token, {
        audience: 'users',
        issuer: 'login',
      });
    } catch (e) {
      throw new BadRequestException(e.message || 'Token inválido');
    }
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = await this.userService.findFirst({email})
    if (!user) throw new UnauthorizedException('E-mail e/ou senha incorretos.');

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }
    return this.createToken(user);
  }
  async forget({ email }: Partial<AuthLoginDTO>) {
    const user = await this.userService.findFirst({email})
   
    if (!user) throw new UnauthorizedException('E-mail  incorreto.');
    const token = this.jwtSerrvice.sign({
      id: user.id
    }, {
      expiresIn: '7 days',
      subject: String(user.id),
      issuer: 'forget',
      audience: 'users',
    },
    )
    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: user.email,
      template: 'forget',
      context: {
        name: user.name,
        token
      }
    })
    return true
  }
  async reset({ password, token }: AuthResetDTO) {
    try {
      const data = this.jwtSerrvice.verify(token, {
        audience: 'users',
        issuer: 'forget',
      })
      if (!data.id) {
        throw new BadRequestException("Token inválido")
      }

      const user = await this.userService.update(data.id,{ password })
      return this.createToken(user);
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async register({name, email, password, birthAt, role}: CreateUserDTO) {
    const user = await this.userService.create({
      name,
      email,
      password,
      birthAt,
      role  
    });
    return this.createToken(user);
  }

  isValidToken(token: string): boolean {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }
}
