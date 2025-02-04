import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthLoginDTO } from 'src/user/dto/auth-login.dto';
import { AuthRegisterDTO } from 'src/user/dto/auth-register.dto';
import { AuthResetDTO } from 'src/user/dto/auth-reset.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @Post('')
  register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('/forget')
  forget(@Body() { email }: Partial<AuthRegisterDTO>) {
    return this.authService.forget({ email });
  }

  @Post('/reset')
  reset(@Body() body: AuthResetDTO) {
    return this.authService.reset(body);
  }

  @UseGuards(AuthGuard)
  @Post('/me')
  me(@User('id') user) {
    return { me: 'ok', user };
  }
}
