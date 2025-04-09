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

  async searchMovie(query: string, page: number = 1) {
    const url = this.getUrl(
      `/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
    );

    const response$ = this.httpService.get(url, this.getAuthHeaders());
    const response = await lastValueFrom(response$);
    const data = response.data;

    const sortedResults = data.results.sort((a, b) =>
      a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }),
    );

    return {
      results: sortedResults,
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
    };
  }

  async getMovieDetails(movieId: string) {
    const url = this.getUrl(`/movie/${movieId}`);

    const response$ = this.httpService.get(url, this.getAuthHeaders());

    try {
      const response = await lastValueFrom(response$);

      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to fetch movie details');
    }
  }

  async getGenres() {
    const url = this.getUrl('/genre/movie/list');
    const response$ = this.httpService.get(url, this.getAuthHeaders());

    try {
      const response = await lastValueFrom(response$);

      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to fetch movie details');
    }
  }

  async getMovies({ page = 1, search }: { page?: number; search?: string }) {
    if (search) {
      return this.searchMovie(search, page);
    }

    const url = `/movie/popular?page=${page}`;
    const response$ = this.httpService.get(
      this.getUrl(url),
      this.getAuthHeaders(),
    );
    const response = await lastValueFrom(response$);

    return {
      results: response.data.results,
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
    };
  }
}
