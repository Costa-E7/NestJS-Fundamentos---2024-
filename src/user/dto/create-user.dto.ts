import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minSymbols: 1,
    },
    {
      message:
        'A senha deve ter pelo menos 6 caracteres, incluindo pelo menos uma letra minúscula e um símbolo.',
    },
  )
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: number;
}
