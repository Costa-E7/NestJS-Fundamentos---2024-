import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password }: CreateUserDTO): Promise<User> {
    const salt: string = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    return this.prisma.user.create({
      data: {
        email,
        name,
        password: passwordHash,
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

  async update(
    id: string,
    userUpdate: UpdatePutUserDTO,
  ): Promise<User> {
    if (!(await this.exist(id))) return;

    if (userUpdate.password) {
      const salt: string = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(userUpdate.password, salt);
      userUpdate.password = passwordHash;
    }
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

  async exist(id: string): Promise<boolean> {
    const user = await this.getById(id);
    return Boolean(user);
  }
}
