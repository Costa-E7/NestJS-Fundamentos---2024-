import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UserService } from './user.service';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from 'src/auth/auth.service';



@UseGuards(RoleGuard)
@UseGuards(AuthGuard, RoleGuard)
@Controller('/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService

  ) {}
  @Roles([Role.Admin])
  @Post()
  async create(@Body() user: CreateUserDTO): Promise<CreateUserDTO> {
    return this.userService.create(user);
  }

  @Roles([Role.Admin])
  @Get()
  async getAllUsers() {
    return this.userService.getAll();
  }

  @Roles([Role.Admin])
  @Get(':id')
  async getOneUser(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Roles([Role.Admin])
  @Put(':id')
  update(@Body() userUpdate: UpdatePutUserDTO, @Param('id') id: string) {
    return this.userService.updateOne(id, userUpdate);
  }
  
  @Roles([Role.Admin])
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
