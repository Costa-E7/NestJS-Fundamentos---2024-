import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class FileService {
  constructor() {}

  async uploadPhoto(user: User, photo: Express.Multer.File) {
    const fileName = `${new Date()}${new Date().getMilliseconds()}`;
    return writeFile(
      `${__dirname}/../../storage/photos/photos-${user.id}${fileName}.png`,
      photo.buffer,
    );
  }
}
