import "./AdminDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Protect dashboard
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(
          "https://cozy-luxury-restaurant-1.onrender.com/api/reservations"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }

        const data = await response.json();

        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://cozy-luxury-restaurant-1.onrender.com/api/orders"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Today's date
  const today = new Date().toISOString().split("T")[0];

  // Today's reservations
  const todaysReservations = reservations.filter(
    (reservation) => reservation.date === today
  );

  // Today's guests
  const todaysGuests = todaysReservations.reduce(
    (total, reservation) =>
      total + Number(reservation.guests || 0),
    0
  );

  // Pending reservations
  const pendingReservations = reservations.filter(
    (reservation) =>
      !reservation.status ||
      reservation.status.toLowerCase() === "pending"
  );

  // Today's orders
  const todaysOrders = orders.filter((order) => {
    if (!order.createdAt) return false;

    const orderDate = new Date(order.createdAt)
      .toISOString()
      .split("T")[0];

    return orderDate === today;
  });

  // Recent reservations
  const recentReservations = reservations.slice(0, 5);

  // Recent orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          LOCAL RESTRO
          <span>CAFE</span>
        </div>

        <nav>

          <button className="sidebar-link active">
            Dashboard
          </button>

          <button className="sidebar-link">
            Reservations
          </button>

          <button className="sidebar-link">
            Orders
          </button>

          <button className="sidebar-link">
            Menu
          </button>

          <button className="sidebar-link">
            Offers
          </button>

          <button className="sidebar-link">
            Gallery
          </button>

        </nav>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("adminLoggedIn");
            navigate("/admin");
          }}
        >
          Logout
        </button>

      </aside>


      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* TOP BAR */}
        <header className="dashboard-header">

          <div>

            <p className="dashboard-label">
              OWNER DASHBOARD
            </p>

            <h1>Welcome back 👋</h1>

          </div>

          <div className="owner-info">

            <div className="owner-avatar">
              O
            </div>

            <div>
              <strong>Cafe Owner</strong>
              <span>Administrator</span>
            </div>

          </div>

        </header>


        {/* STAT CARDS */}
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>
              <p>Today's Reservations</p>
              <h2>{todaysReservations.length}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>
              <p>Today's Guests</p>
              <h2>{todaysGuests}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>
              <p>Pending Reservations</p>
              <h2>{pendingReservations.length}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🍽️
            </div>

            <div>
              <p>Today's Orders</p>

              <h2>
                {todaysOrders.length}
              </h2>

            </div>

          </div>

        </section>


        {/* RESERVATIONS */}
        <section className="reservations-section">

          <div className="section-header">

            <div>

              <p className="dashboard-label">
                RESERVATIONS
              </p>

              <h2>Recent Reservations</h2>

            </div>

            <button className="view-all-btn">
              View All
            </button>

          </div>


          <div className="reservation-table">

            <div className="table-header">

              <span>Customer</span>
              <span>Date</span>
              <span>Time</span>
              <span>Guests</span>
              <span>Status</span>

            </div>


            {loading ? (

              <div className="empty-reservations">

                <div className="empty-icon">
                  ⏳
                </div>

                <h3>
                  Loading reservations...
                </h3>

                <p>
                  Please wait while we fetch the reservations.
                </p>

              </div>

            ) : recentReservations.length === 0 ? (

              <div className="empty-reservations">

                <div className="empty-icon">
                  📅
                </div>

                <h3>
                  No reservations yet
                </h3>

                <p>
                  Customer reservations will appear here.
                </p>

              </div>

            ) : (

              recentReservations.map((reservation) => (

                <div
                  className="reservation-row"
                  key={reservation._id}
                >

                  <span>
                    {reservation.name}
                  </span>

                  <span>
                    {reservation.date}
                  </span>

                  <span>
                    {reservation.time}
                  </span>

                  <span>
                    {reservation.guests || "-"}
                  </span>

                  <span>
                    {reservation.status || "Pending"}
                  </span>

                </div>

              ))

            )}

          </div>

        </section>


        {/* ORDERS */}
        <section className="reservations-section">

          <div className="section-header">

            <div>

              <p className="dashboard-label">
                ORDERS
              </p>

              <h2>Recent Orders</h2>

            </div>

          </div>


          <div className="reservation-table">

            <div className="table-header">

              <span>Customer</span>
              <span>Phone</span>
              <span>Items</span>
              <span>Total</span>
              <span>Status</span>

            </div>


            {ordersLoading ? (

              <div className="empty-reservations">

                <div className="empty-icon">
                  ⏳
                </div>

                <h3>
                  Loading orders...
                </h3>

                <p>
                  Please wait while we fetch the orders.
                </p>

              </div>

            ) : recentOrders.length === 0 ? (

              <div className="empty-reservations">

                <div className="empty-icon">
                  🍽️
                </div>

                <h3>
                  No orders yet
                </h3>

                <p>
                  Customer orders will appear here.
                </p>

              </div>

            ) : (

              recentOrders.map((order) => (

                <div
                  className="reservation-row"
                  key={order._id}
                >

                  <span>
                    {order.customerName}
                  </span>

                  <span>
                    {order.phone}
                  </span>

                  <span>
                    {order.items
                      ?.map(
                        (item) =>
                          `${item.name} × ${item.quantity}`
                      )
                      .join(", ")}
                  </span>

                  <span>
                    ₹{order.totalAmount}
                  </span>

                  <span>
                    {order.status || "Pending"}
                  </span>

                </div>

              ))

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;