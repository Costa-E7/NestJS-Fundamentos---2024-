import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.create(user);
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAll();
  }

  @Get(':id')
  async getOneUser(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Put(':id')
  update(@Body() userUpdate: UpdatePutUserDto, @Param('id') id: string) {
    return this.userService.updateOne(id, userUpdate);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
