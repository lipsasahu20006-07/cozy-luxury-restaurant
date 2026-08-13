import "./AdminOrders.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Protect admin page
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Change order status
  const handleStatusChange = async (id, status) => {
    try {
     const response = await fetch(
  `http://localhost:5000/api/orders/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === id ? updatedOrder : order
        )
      );

      alert(`Order status changed to ${status}`);
    } catch (error) {
      console.error("Status update error:", error);

      alert("Failed to update order status.");
    }
  };

  return (
    <div className="admin-orders-page">

      {/* HEADER */}
      <div className="admin-orders-header">

        <div>
          <p className="dashboard-label">
            ORDER MANAGEMENT
          </p>

          <h1>Customer Orders</h1>

          <p>
            View and manage all orders placed by customers.
          </p>
        </div>

        <div className="orders-header-buttons">

          <button
            className="refresh-orders-btn"
            onClick={fetchOrders}
          >
            🔄 Refresh
          </button>

          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin")}
          >
            ← Dashboard
          </button>

        </div>

      </div>


      {/* ORDERS */}
      {loading ? (

        <div className="orders-message">

          <div className="orders-icon">
            ⏳
          </div>

          <h2>
            Loading orders...
          </h2>

          <p>
            Please wait while we fetch customer orders.
          </p>

        </div>

      ) : orders.length === 0 ? (

        <div className="orders-message">

          <div className="orders-icon">
            🍽️
          </div>

          <h2>
            No orders yet
          </h2>

          <p>
            Customer orders will appear here.
          </p>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="admin-order-card"
              key={order._id}
            >

              {/* ORDER TOP */}
              <div className="order-card-header">

                <div>

                  <h2>
                    {order.customerName}
                  </h2>

                  <p>
                    📞 {order.phone}
                  </p>

                </div>

                {/* STATUS DROPDOWN */}
                <select
                  className="order-status-select"
                  value={order.status || "Pending"}
                  onChange={(e) =>
                    handleStatusChange(
                      order._id,
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

                  <option value="Preparing">
                    Preparing
                  </option>

                  <option value="Out for Delivery">
                    Out for Delivery
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>


              {/* DELIVERY ADDRESS */}
              <div className="order-detail">

                <h3>
                  📍 Delivery Address
                </h3>

                <p>
                  {order.address}
                </p>

              </div>


              {/* ITEMS */}
              <div className="order-detail">

                <h3>
                  🍽️ Ordered Items
                </h3>

                <div className="ordered-items">

                  {order.items?.map((item) => (

                    <div
                      className="ordered-item"
                      key={item._id || item.name}
                    >

                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <strong>
                        ₹{item.price * item.quantity}
                      </strong>

                    </div>

                  ))}

                </div>

              </div>


              {/* INSTRUCTIONS */}
              {order.instructions && (

                <div className="order-detail">

                  <h3>
                    📝 Instructions
                  </h3>

                  <p>
                    {order.instructions}
                  </p>

                </div>

              )}


              {/* FOOTER */}
              <div className="order-card-footer">

                <span>
                  Order Total
                </span>

                <strong>
                  ₹{order.totalAmount}
                </strong>

              </div>


              <div className="order-date">

                Ordered on{" "}

                {new Date(
                  order.createdAt
                ).toLocaleString()}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminOrders;