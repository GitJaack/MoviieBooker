import { IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class ReservationDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  movieId: number;

  @IsDateString()
  @IsNotEmpty()
  startTime: Date;
}

export class ReservationResponseDto {
  id: number;
  userId: number;
  movieId: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}
