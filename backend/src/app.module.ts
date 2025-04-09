import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesService } from './movies/movies.service';
import { MoviesController } from './movies/movies.controller';
import { MoviesModule } from './movies/movies.module';
import { HttpModule } from '@nestjs/axios';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MoviesModule,
    HttpModule,
    ReservationModule,
  ],
  controllers: [AppController, MoviesController],
  providers: [AppService, MoviesService],
})
export class AppModule {}
