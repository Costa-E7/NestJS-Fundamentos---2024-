import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePutUserDto } from "./dto/update-put-user.dto";

@Controller('/users')
export class UserController {

    @Post()
    create(@Body() {email, name, password}): CreateUserDto{
        return {
            name,email,password    
        }    
    }

    @Get()
    async getAllUsers(){
        return {users: []}
    }

    @Get(':id')
    async getOneUser(@Param('id', ParseIntPipe) id: number){
        return id

    }

    @Put(':id')
    update(@Body() {email,name,password}: UpdatePutUserDto  , @Param('id', ParseIntPipe) id: number){
        return{
            method: 'put',
            email,name,password,
            id
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number){
        return id
    }
}