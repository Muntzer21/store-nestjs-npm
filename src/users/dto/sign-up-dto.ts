import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  @IsNotEmpty()
      @MinLength(4,{message:'the password must be 4 char or more'})
  password: string;
}