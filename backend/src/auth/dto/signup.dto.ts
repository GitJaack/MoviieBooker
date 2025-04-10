import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDTO {
  @ApiProperty({ example: 'user1@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(4)
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;
}
