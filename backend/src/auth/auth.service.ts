import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDTO } from './dto/signup.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signUp(signUpData: SignUpDTO) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: signUpData.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(signUpData.password, saltOrRounds);

    const newUser = await this.prisma.user.create({
      data: {
        username: signUpData.username,
        password: hashedPassword,
      },
    });

    return {
      message: 'User successfully registered',
      userId: newUser.id,
    };
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new UnauthorizedException('User not found');

    const passwordValid = await bcrypt.compare(pass, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
