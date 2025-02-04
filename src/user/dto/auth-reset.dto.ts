import { IsJWT, IsStrongPassword } from 'class-validator';

export class AuthResetDTO {
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

  @IsJWT()
  token: string;
}
