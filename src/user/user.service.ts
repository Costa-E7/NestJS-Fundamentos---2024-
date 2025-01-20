import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDto } from './dto/update-put-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create({ email, name, password }: CreateUserDto): Promise<CreateUserDto> {
    return this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  }

  getAll(): Promise<CreateUserDto[]> {
    return this.prisma.user.findMany();
  }

  getById(id: string): Promise<CreateUserDto> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  updateOne(id: string, userUpdate: UpdatePutUserDto): Promise<CreateUserDto> {
    return this.prisma.user.update({
      where: { id },
      data: { ...userUpdate },
    });
  }

  async delete(id: string) {
    const user: UpdatePutUserDto = await this.getById(id);
    if (!user)
      throw new NotFoundException(`Usuario com Id ${id} não encontrado`);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
