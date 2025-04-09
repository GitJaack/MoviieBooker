import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { ReservationDto, ReservationResponseDto } from './dto/reservationDto';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une réservation' })
  @ApiBody({ type: ReservationDto })
  @ApiResponse({
    status: 201,
    description: 'Réservation créée avec succès',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      "La réservation doit être effectuée au moins 2 heures à l'avance",
  })
  @ApiResponse({
    status: 409,
    description: 'Un autre créneau existe déjà pour ce film',
  })
  async createReservation(@Body() createReservationDto: ReservationDto) {
    try {
      const reservation =
        await this.reservationService.createReservation(createReservationDto);
      return reservation;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Obtenir les réservations d’un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Liste des réservations de l’utilisateur.',
    type: [ReservationResponseDto],
  })
  async getReservations(@Param('userId') userId: number) {
    return this.reservationService.getReservationsByUser(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiResponse({
    status: 200,
    description: 'Réservation annulée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Réservation non trouvée.',
  })
  async cancelReservation(@Param('id') id: number) {
    return this.reservationService.cancelReservation(id);
  }
}
