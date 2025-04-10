import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number | null;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const response = await axios.get(
        `https://moviiebooker-0eje.onrender.com/movies/movie/${id}`
      );
      return response.data as Movie;
    },
  });

  const createReservation = useMutation({
    mutationFn: async () => {
      const startTime = `${selectedDate}T${selectedTime}:00.000Z`;
      return axios.post(
        "https://moviiebooker-0eje.onrender.com/reservations",
        {
          movieId: Number(id),
          startTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      navigate("/profile");
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la réservation"
      );
    },
  });

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    createReservation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center text-red-600 text-black text-black">
        Film non trouvé
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=Image+non+disponible"
            }
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-black">{movie.title}</h1>
          <p className="text-gray-600">{movie.overview}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-black">Date de sortie</h3>
              <p className="text-black">
                {new Date(movie.release_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-black">Durée</h3>
              <p className="text-black">{movie.runtime} minutes</p>
            </div>
            <div>
              <h3 className="font-semibold text-black">Note</h3>
              <p className="text-black">
                {movie.vote_average?.toFixed(1) || "N/A"}/10
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-black">Réserver</h2>
            <form onSubmit={handleReservation} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  min={today}
                  max={maxDateString}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Heure
                </label>
                <select
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez une heure</option>
                  <option value="14:00">14:00</option>
                  <option value="16:30">16:30</option>
                  <option value="19:00">19:00</option>
                  <option value="21:30">21:30</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={createReservation.isPending}
              >
                {createReservation.isPending
                  ? "Réservation en cours..."
                  : "Réserver"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
