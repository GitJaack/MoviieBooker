import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

const Home = () => {
  const { data: movies, isLoading } = useQuery({
    queryKey: ["nowPlaying"],
    queryFn: async () => {
      const response = await axios.get(
        "https://moviiebooker-0eje.onrender.com/movies/now-playing"
      );
      return response.data.results as Movie[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-600">
          Bienvenue sur MovieBooker
        </h1>
        <p className="text-xl text-gray-600">
          Réservez vos places de cinéma en quelques clics
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-black">Films à l'affiche</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies?.slice(0, 8).map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {movie.overview}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/movies"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Voir tous les films
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
