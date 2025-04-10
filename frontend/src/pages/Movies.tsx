import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { moviesApi } from "../services/api";
import debounce from "lodash/debounce";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number | null;
}

const Movies = () => {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["movies", page, searchTerm],
    queryFn: async () => {
      const response = await (searchTerm
        ? moviesApi.search(searchTerm)
        : moviesApi.getNowPlaying(page));
      return response.data;
    },
  });

  // Création d'une fonction debounce pour la recherche
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const movies = data?.results as Movie[];
  const totalPages = data?.total_pages || 1;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Films à l'affiche</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un film..."
            value={inputValue}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies?.map((movie) => (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/placeholder-movie.jpg"
              }
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString("fr-FR")
                    : "Date inconnue"}
                </span>
                <span>
                  {movie.vote_average !== null
                    ? `${movie.vote_average.toFixed(1)}/10`
                    : "Pas de note"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!searchTerm && movies?.length > 0 && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Précédent
          </button>
          <span className="px-4 py-2 text-black">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      )}

      {movies?.length === 0 && (
        <div className="text-center text-gray-600">
          Aucun film trouvé pour votre recherche
        </div>
      )}
    </div>
  );
};

export default Movies;
