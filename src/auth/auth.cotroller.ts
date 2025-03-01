import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDTO } from 'src/user/dto/auth-login.dto';
import { AuthRegisterDTO } from 'src/user/dto/auth-register.dto';
import { AuthResetDTO } from 'src/user/dto/auth-reset.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorator/user.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
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
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('/photo')
  async uploadPhoto(
    @User() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image/*',
          }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    await this.fileService.uploadPhoto(user, photo);
    return { sucess: true };
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('/files')
  async uploadFiles(
    @User() user,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return files;
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'photo',
        maxCount: 1,
      },
      {
        name: 'documents',
        maxCount: 10,
      },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('/files-fields')
  async uploadFilesFields(
    @User() user,
    @UploadedFiles()
    files: { photo: Express.Multer.File; documents: Express.Multer.File[] },
  ) {
    return files;
  }
}
