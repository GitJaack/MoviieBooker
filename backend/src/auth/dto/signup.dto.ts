import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDTO {
  @ApiProperty({ example: 'user1' })
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(4)
  password: string;
}
