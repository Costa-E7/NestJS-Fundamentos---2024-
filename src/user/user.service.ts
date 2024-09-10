import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService
    ){}
    
    create({email, name, password}: CreateUserDto){
        
        this.prisma.user.create({
            data: {
                email,
                name,
                password
            }
        })
    }
}