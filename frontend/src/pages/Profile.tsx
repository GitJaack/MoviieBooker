import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationsApi } from "../services/api";

interface Reservation {
  id: number;
  movieId: number;
  movieTitle: string;
  startTime: string;
  endTime: string;
}

const Profile = () => {
  const queryClient = useQueryClient();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const response = await reservationsApi.getAll();
      return response.data as Reservation[];
    },
  });

  const cancelReservation = useMutation({
    mutationFn: async (reservationId: number) => {
      return reservationsApi.cancel(reservationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-black">Mes Réservations</h1>
      {reservations?.length === 0 ? (
        <div className="text-center text-gray-600">
          Vous n'avez pas encore de réservations
        </div>
      ) : (
        <div className="space-y-4">
          {reservations?.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">
                    {reservation.movieTitle}
                  </h3>
                  <p className="text-gray-600">
                    Le{" "}
                    {new Date(reservation.startTime).toLocaleDateString(
                      "fr-FR",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-gray-600">
                    à{" "}
                    {new Date(reservation.startTime).toLocaleTimeString(
                      "fr-FR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <button
                  onClick={() => cancelReservation.mutate(reservation.id)}
                  disabled={cancelReservation.isPending}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {cancelReservation.isPending ? "Annulation..." : "Annuler"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
