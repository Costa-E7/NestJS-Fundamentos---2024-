import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";


export const User = createParamDecorator((filter : string, context: ExecutionContext) =>{
    const request = context.switchToHttp().getRequest();
    const { user } = request
    if (user) {
        if (filter) return user[filter]
        return user
    }

    throw new NotFoundException("Usuario não encontrado no request")
})