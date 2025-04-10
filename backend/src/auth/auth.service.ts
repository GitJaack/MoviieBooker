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
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signUp(signUpData: SignUpDTO) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUpData.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(signUpData.password, saltOrRounds);

    const newUser = await this.prisma.user.create({
      data: {
        email: signUpData.email,
        password: hashedPassword,
      },
    });

    return {
      message: 'User successfully registered',
      userId: newUser.id,
    };
  }

  async signIn(signInData: LoginDTO): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(signInData.email);
    if (!user)
      throw new UnauthorizedException(
        `User not found for email : ${signInData.email}`,
      );

    const passwordValid = await bcrypt.compare(
      signInData.password,
      user.password,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    return {
      access_token: this.jwtService.sign({ userId: user.id }),
    };
  }
}
