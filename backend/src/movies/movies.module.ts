import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Module({
  imports: [HttpModule],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
