import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthLoginDTO } from 'src/user/dto/auth-login.dto';
import { AuthRegisterDTO } from 'src/user/dto/auth-register.dto';
import { AuthResetDTO } from 'src/user/dto/auth-reset.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from  'bcrypt'
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  constructor(
  ) {}

  async uploadPhoto(user: User, photo: Express.Multer.File){
      const fileName = `${new Date()}${new Date().getMilliseconds()}`
      return writeFile(`${__dirname}/../../storage/photos/photos-${user.id}${fileName}.png`,photo.buffer, )
  }
}
