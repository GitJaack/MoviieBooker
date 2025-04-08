import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(username: string, plainPassword: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltOrRounds);
    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  }

  async deleteUser(userId: number) {
    const id = parseInt(userId.toString(), 10);

    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id: id },
    });

    return { message: 'User successfully deleted' };
  }

  async findOne(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
