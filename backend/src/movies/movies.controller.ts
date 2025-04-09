import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('TMBD')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of movies now playing',
    type: Object,
  })
  @ApiOperation({ summary: 'Films en salle actuellement' })
  @Get('now-playing')
  async getNowPlaying(@Query('page') page: number = 1) {
    return this.moviesService.getNowPlaying(Number(page));
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher un film par son titre' })
  @ApiQuery({
    name: 'title',
    required: true,
    type: String,
    description: 'Titre du film à rechercher',
  })
  @ApiResponse({ status: 200, description: 'Films trouvés' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  searchMovies(@Query('title') title: string) {
    return this.moviesService.searchMovie(title);
  }

  @Get('movie/:id')
  @ApiOperation({ summary: 'Détails d’un film par ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'ID du film TMDB',
  })
  @ApiResponse({ status: 200, description: 'Détails du film' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  getMovieDetails(@Param('id') id: string) {
    return this.moviesService.getMovieDetails(id);
  }

  @Get('genres')
  @ApiOperation({ summary: 'Obtenir la liste des genres de films' })
  getGenres() {
    return this.moviesService.getGenres();
  }

  @Get('movies')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  getMovies(@Query('page') page?: number, @Query('search') search?: string) {
    return this.moviesService.getMovies({
      page: Number(page) || 1,
      search,
    });
  }
}
