import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReservationDto, ReservationResponseDto } from './dto/reservationDto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une réservation',
  })
  @ApiBody({
    type: ReservationDto,
    examples: {
      example1: {
        summary: 'Exemple de création de réservation',
        value: {
          movieId: 550,
          startTime: '2024-03-20T15:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Réservation créée avec succès',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Film non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflit de réservation',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example:
            'Conflit avec une réservation existante. Vous avez déjà réservé un film sur ce créneau horaire.',
        },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  })
  async createReservation(
    @Request() req,
    @Body() createReservationDto: Omit<ReservationDto, 'userId'>,
  ) {
    const userId = req.user.userId;
    return this.reservationService.createReservation({
      ...createReservationDto,
      userId,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Obtenir mes réservations',
  })
  @ApiResponse({
    status: 200,
    description: "Liste des réservations de l'utilisateur",
    type: [ReservationResponseDto],
  })
  async getReservations(@Request() req) {
    const userId = req.user.userId;
    return this.reservationService.getUserReservations(userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Annuler une réservation',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la réservation à annuler',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Réservation annulée avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Réservation annulée avec succès' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Réservation non trouvée',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Réservation non trouvée',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async cancelReservation(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.reservationService.cancelReservation(userId, id);
  }
}
