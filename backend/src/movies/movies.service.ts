import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class MoviesService {
  private readonly BASE_URL = 'https://api.themoviedb.org/3';

  constructor(private readonly httpService: HttpService) {}

  private getUrl(endpoint: string): string {
    return `${this.BASE_URL}${endpoint}?language=us-US`;
  }

  private getAuthHeaders(): AxiosRequestConfig {
    return {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    };
  }

  async getNowPlaying(page: number = 1) {
    const url = `${this.getUrl('/movie/now_playing')}&page=${page}`;

    const response$ = this.httpService.get(url, this.getAuthHeaders());

    try {
      const response = await lastValueFrom(response$);

      return response.data;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw new Error('Failed to fetch now playing movies');
    }
  }

  async searchMovie(title: string) {
    const url = `${this.getUrl('/search/movie')}?query=${encodeURIComponent(title)}`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data;
  }

  async getMovieDetails(movieId: string) {
    const url = this.getUrl(`/movie/${movieId}`);
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data;
  }

  async getGenres() {
    const url = this.getUrl('/genre/movie/list');
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data;
  }

  async getMovies(options: { page?: number; search?: string; sort?: string }) {
    const { page = 1, search, sort } = options;

    // S'il y a un filtre de recherche, on utilise le endpoint de recherche
    if (search) {
      const url = `${this.getUrl('/search/movie')}&query=${encodeURIComponent(search)}&page=${page}`;
      const response = await lastValueFrom(this.httpService.get(url));
      return response.data;
    }

    // Sinon, on utilise un endpoint basé sur le tri
    let endpoint = '/movie/now_playing'; // par défaut

    if (sort === 'popular') endpoint = '/movie/popular';
    if (sort === 'top_rated') endpoint = '/movie/top_rated';
    if (sort === 'upcoming') endpoint = '/movie/upcoming';

    const url = `${this.getUrl(endpoint)}&page=${page}`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data;
  }
}
