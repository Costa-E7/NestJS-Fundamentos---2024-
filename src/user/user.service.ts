import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create({ email, name, password }: CreateUserDTO): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  }

  getAll(): Promise<CreateUserDTO[]> {
    return this.prisma.user.findMany();
  }

  getById(id: string): Promise<CreateUserDTO> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  updateOne(id: string, userUpdate: UpdatePutUserDTO): Promise<CreateUserDTO> {
    return this.prisma.user.update({
      where: { id },
      data: { ...userUpdate },
    });
  }

  async delete(id: string) {
    const user: UpdatePutUserDTO = await this.getById(id);
    if (!user)
      throw new NotFoundException(`Usuario com Id ${id} não encontrado`);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
