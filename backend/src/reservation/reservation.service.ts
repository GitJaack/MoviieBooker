import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReservationDto } from './dto/reservationDto';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async createReservation(
    reservationDto: ReservationDto,
  ): Promise<ReservationDto> {
    const { userId, movieId, startTime } = reservationDto;

    // Convertir startTime en objet Date (si c'est une chaîne)
    const startDate = new Date(startTime);

    // Calcul de l'heure de fin (2 heures après startTime)
    const endTime = new Date(startDate);
    endTime.setHours(endTime.getHours() + 2);

    // Vérification que la réservation est au moins 2 heures à l'avance
    const minTime = new Date();
    minTime.setHours(minTime.getHours() + 2); // Minimum 2 heures

    if (startDate < minTime) {
      throw new BadRequestException(
        "La réservation doit être effectuée au moins 2 heures à l'avance.",
      );
    }

    // Vérification des conflits de réservation pour l'utilisateur
    const existingReservation = await this.prisma.reservation.findFirst({
      where: {
        userId,
        movieId,
        AND: [
          {
            startTime: {
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: startDate,
            },
          },
        ],
      },
    });

    if (existingReservation) {
      throw new ConflictException(
        'Il y a un conflit de réservation sur cette plage horaire.',
      );
    }

    return this.prisma.reservation.create({
      data: {
        userId,
        movieId,
        startTime: startDate,
        endTime,
      },
    });
  }

  async getReservationsByUser(userId: number) {
    return this.prisma.reservation.findMany({
      where: { userId },
    });
  }

  async cancelReservation(reservationId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation) {
      throw new BadRequestException('Réservation non trouvée.');
    }
    return this.prisma.reservation.delete({
      where: { id: reservationId },
    });
  }
}
