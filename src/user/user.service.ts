import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(user: CreateUserDTO): Promise<User> {
    const salt: string = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(user.password, salt);
    if (await this.userRepository.exists({where: {email: user.email}})) throw new BadRequestException('Este e-mail já está sendo usado')
      return this.userRepository.save({
        ...user,
        password: passwordHash  
      })  
    
  }

  getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getById(id: number): Promise<User>  {
    return this.findFirst({id: id
    });
  }

  async update(
    id: number,
    userUpdate: UpdatePutUserDTO,
  ): Promise<User> {
    if (!(await this.exist(id))) return;

    if (userUpdate.password) {
      const salt: string = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(userUpdate.password, salt);
      userUpdate.password = passwordHash;
    }
    await this.userRepository.update(id,{...userUpdate});
    this.findFirst({id})  
  }

  async delete(id: number) {
    const user: User = await this.getById(id);
    if (!user)
      throw new NotFoundException(`Usuario com Id ${id} não encontrado`);
    return this.userRepository.delete(id)
  }

  async exist(id: number): Promise<boolean> {
    const user = await this.userRepository.find({
      where:{
        id: id
      }
    });
    return Boolean(user);
  }

  async findFirst(user: Partial<User>): Promise<User>{
    return this.userRepository.findOne({
      where: {
        ...user,
      },
    });
  }
}
