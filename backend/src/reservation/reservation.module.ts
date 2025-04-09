import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [ReservationService, PrismaService],
  controllers: [ReservationController],
})
export class ReservationModule {}
