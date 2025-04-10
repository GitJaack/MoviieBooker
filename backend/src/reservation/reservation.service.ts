import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReservationDto } from './dto/reservationDto';
import { MoviesService } from 'src/movies/movies.service';

@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService,
    private movieService: MoviesService,
  ) {}

  async checkForConflicts(
    userId: number,
    startTime: Date,
    endTime: Date,
    excludeReservationId = null,
  ) {
    const conflicts = await this.prisma.reservation.findFirst({
      where: {
        userId: userId,
        id: excludeReservationId ? { not: excludeReservationId } : undefined,
        OR: [
          // La nouvelle réservation commence pendant une réservation existante
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          // La nouvelle réservation se termine pendant une réservation existante
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          // La nouvelle réservation englobe entièrement une réservation existante
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    return conflicts;
  }

  async createReservation(reservationDto: ReservationDto & { userId: number }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: reservationDto.userId },
      });

      if (!user) {
        throw new NotFoundException(
          `L'utilisateur avec l'ID ${reservationDto.userId} n'existe pas`,
        );
      }

      const movieDetails = await this.movieService.getMovieDetails(
        reservationDto.movieId,
      );
      if (!movieDetails) {
        throw new Error('Film non trouvé dans la base de données TMDB');
      }

      const startTime = new Date(reservationDto.startTime);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);

      const conflict = await this.checkForConflicts(
        reservationDto.userId,
        startTime,
        endTime,
      );
      if (conflict) {
        throw new ConflictException(
          'Conflit avec une réservation existante. Vous avez déjà réservé un film sur ce créneau horaire.',
        );
      }

      const reservation = await this.prisma.reservation.create({
        data: {
          userId: reservationDto.userId,
          movieId: reservationDto.movieId,
          movieTitle: movieDetails.title,
          startTime: startTime,
          endTime: endTime,
        },
      });

      return reservation;
    } catch (error) {
      throw error;
    }
  }

  async getUserReservations(userId: string | number) {
    try {
      const userIdNumber = Number(userId);

      if (isNaN(userIdNumber)) {
        throw new BadRequestException(
          "L'ID de l'utilisateur doit être un nombre",
        );
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userIdNumber },
      });

      if (!user) {
        throw new NotFoundException(
          `L'utilisateur avec l'ID ${userIdNumber} n'existe pas`,
        );
      }

      return await this.prisma.reservation.findMany({
        where: { userId: userIdNumber },
        orderBy: { startTime: 'asc' },
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        "Une erreur s'est produite lors de la récupération des réservations",
      );
    }
  }

  async cancelReservation(
    userId: string | number,
    reservationId: string | number,
  ) {
    try {
      const userIdNumber = Number(userId);
      const reservationIdNumber = Number(reservationId);

      if (isNaN(userIdNumber) || isNaN(reservationIdNumber)) {
        throw new BadRequestException(
          'Les IDs doivent être des nombres valides',
        );
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userIdNumber },
      });

      if (!user) {
        throw new NotFoundException(
          `L'utilisateur avec l'ID ${userIdNumber} n'existe pas`,
        );
      }

      const reservation = await this.prisma.reservation.findFirst({
        where: {
          id: reservationIdNumber,
          userId: userIdNumber,
        },
      });

      if (!reservation) {
        throw new NotFoundException('Réservation non trouvée');
      }

      await this.prisma.reservation.delete({
        where: { id: reservationIdNumber },
      });

      return { message: 'Réservation annulée avec succès' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        "Une erreur s'est produite lors de l'annulation de la réservation",
      );
    }
  }
}
