import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReservationDto {
  userId?: number;

  @ApiProperty({ example: 550, description: 'ID du film à réserver' })
  @IsInt()
  @IsNotEmpty()
  movieId: number;

  @ApiProperty({
    example: '2024-03-20T15:00:00Z',
    description: 'Date et heure de début de la séance',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;
}

export class ReservationResponseDto {
  @ApiProperty({ example: 1, description: 'ID unique de la réservation' })
  id: number;

  @ApiProperty({
    example: 1,
    description: "ID de l'utilisateur qui a fait la réservation",
  })
  userId: number;

  @ApiProperty({ example: 550, description: 'ID du film réservé' })
  movieId: number;

  @ApiProperty({ example: 'Fight Club', description: 'Titre du film' })
  movieTitle: string;

  @ApiProperty({
    example: '2024-03-20T15:00:00Z',
    description: 'Date et heure de début de la séance',
  })
  startTime: string;

  @ApiProperty({
    example: '2024-03-20T17:00:00Z',
    description: 'Date et heure de fin de la séance',
  })
  endTime: string;

  @ApiProperty({
    example: '2024-03-19T10:00:00Z',
    description: 'Date et heure de création de la réservation',
  })
  createdAt: string;
}
