import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Fetch reservations
  const fetchReservations = () => {
    setLoading(true);

    fetch(
      "https://cozy-luxury-restaurant-1.onrender.com/api/admin/reservations"
    )
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Today's date
  const today = new Date().toISOString().split("T")[0];

  // Statistics
  const totalReservations = reservations.length;

  const todayReservations = reservations.filter(
    (reservation) => reservation.date === today
  );

  const todayReservationCount = todayReservations.length;

  // Today's total guests
  const todayGuests = todayReservations.reduce(
    (total, reservation) => {
      return total + Number(reservation.guests || 0);
    },
    0
  );

  // Upcoming reservations
  const upcomingReservations = reservations.filter(
    (reservation) => reservation.date > today
  ).length;

  // Search
  const filteredReservations = reservations.filter((reservation) => {
    const search = searchTerm.toLowerCase();

    return (
      reservation.name?.toLowerCase().includes(search) ||
      reservation.email?.toLowerCase().includes(search) ||
      reservation.phone?.includes(search)
    );
  });

  // Update reservation status
  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(
        `https://cozy-luxury-restaurant-1.onrender.com/api/admin/reservations/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedReservation = await response.json();

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === id
            ? updatedReservation
            : reservation
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update reservation status.");
    }
  };

  // Delete reservation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reservation?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://cozy-luxury-restaurant-1.onrender.com/api/admin/reservations/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setReservations((prev) =>
          prev.filter((reservation) => reservation._id !== id)
        );

        alert("Reservation deleted successfully!");
      } else {
        alert("Failed to delete reservation.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin-login");
  };

  return (
    <div className="admin-page">

      {/* Header */}
      <div className="admin-header">

        <div>
          <h1>Admin Dashboard</h1>
          <p>Restaurant Reservations</p>
        </div>

        <div className="admin-header-actions">

          <button
            className="orders-btn"
            onClick={() => navigate("/admin/orders")}
          >
            🍽️ Orders
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>


      {/* Statistics */}
      <div className="admin-stats">

        <div className="stat-card">
          <h3>Total Reservations</h3>
          <p>{totalReservations}</p>
        </div>

        <div className="stat-card">
          <h3>Today's Reservations</h3>
          <p>{todayReservationCount}</p>
        </div>

        <div className="stat-card">
          <h3>Today's Guests</h3>
          <p>{todayGuests}</p>
        </div>

        <div className="stat-card">
          <h3>Upcoming Reservations</h3>
          <p>{upcomingReservations}</p>
        </div>

      </div>


      {/* Search and Refresh */}
      <div className="admin-actions">

        <div className="search-container">

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        <button
          className="refresh-btn"
          onClick={fetchReservations}
        >
          🔄 Refresh
        </button>

      </div>


      {/* Reservation Table */}
      {loading ? (

        <p className="loading">
          Loading reservations...
        </p>

      ) : filteredReservations.length === 0 ? (

        <p className="empty">
          No reservations found.
        </p>

      ) : (

        <div className="reservation-table-container">

          <table className="reservation-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Booked On</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredReservations.map(
                (reservation) => (

                  <tr key={reservation._id}>

                    <td>
                      {reservation.name}
                    </td>

                    <td>
                      {reservation.email}
                    </td>

                    <td>
                      {reservation.phone}
                    </td>

                    <td>
                      {reservation.date}
                    </td>

                    <td>
                      {reservation.time}
                    </td>

                    <td>
                      {reservation.guests || 0}
                    </td>

                    <td>

                      <select
                        value={
                          reservation.status ||
                          "Pending"
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            reservation._id,
                            e.target.value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </td>

                    <td>
                      {reservation.createdAt
                        ? new Date(
                            reservation.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            reservation._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default Admin;