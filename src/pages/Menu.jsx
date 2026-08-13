import "./Menu.css";
import { useState } from "react";

function Menu() {
  const [cart, setCart] = useState([]);

  const [showOrderForm, setShowOrderForm] = useState(false);

  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    address: "",
    instructions: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  // =========================
  // ADD TO ORDER
  // =========================

  const addToOrder = (item) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.name === item.name
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.name === item.name
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = (name) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.name === name
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = (name) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.name === name
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =========================
  // TOTAL
  // =========================

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // =========================
  // FORM CHANGE
  // =========================

  const handleOrderChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!orderData.name || !orderData.phone || !orderData.address) {
      alert("Please fill in your name, phone number and delivery address.");
      return;
    }

    try {
      const response = await fetch(
  "https://cozy-luxury-restaurant-1.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: orderData.name,
            phone: orderData.phone,
            address: orderData.address,
            instructions: orderData.instructions,
            items: cart,
            total: totalAmount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order.");
      }

      setOrderPlaced(true);

      setCart([]);

      setOrderData({
        name: "",
        phone: "",
        address: "",
        instructions: "",
      });

      setShowOrderForm(false);

      alert("🎉 Order Placed Successfully!");
    } catch (error) {
      console.error("Order error:", error);
      alert(error.message || "Failed to place order.");
    }
  };

  return (
    <div className="menu-page">

      {/* =========================
          ORDER BOX
      ========================= */}

      {cart.length > 0 && (
        <div className="order-box">

          <h2>Your Order 🛒</h2>

          {cart.map((item) => (
            <div className="order-item" key={item.name}>

              <span>{item.name}</span>

              <div className="quantity-controls">

                <button
                  onClick={() => decreaseQuantity(item.name)}
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increaseQuantity(item.name)}
                >
                  +
                </button>

              </div>

              <span>
                ₹{item.price * item.quantity}
              </span>

            </div>
          ))}

          <div className="order-total">

            <strong>Total</strong>

            <strong>
              ₹{totalAmount}
            </strong>

          </div>

          <button
            className="checkout-btn"
            onClick={() => setShowOrderForm(true)}
          >
            Continue to Delivery
          </button>

        </div>
      )}


      {/* =========================
          DELIVERY FORM
      ========================= */}

      {showOrderForm && (
        <div className="order-form-section">

          <div className="order-form-box">

            <button
              className="close-order"
              onClick={() => setShowOrderForm(false)}
            >
              ×
            </button>


            <div className="delivery-heading">

              <p className="delivery-label">
                LOCAL RESTRO CAFE
              </p>

              <h2>Delivery Details</h2>

              <p>
                Enter your details so we can prepare your order.
              </p>

            </div>


            <form onSubmit={handlePlaceOrder}>

              {/* NAME + PHONE */}

              <div className="form-row">

                <div className="form-group">

                  <label>Your Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={orderData.name}
                    onChange={handleOrderChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={orderData.phone}
                    onChange={handleOrderChange}
                    required
                  />

                </div>

              </div>


              {/* ADDRESS */}

              <div className="form-group">

                <label>Delivery Address</label>

                <textarea
                  name="address"
                  placeholder="Enter your complete delivery address"
                  value={orderData.address}
                  onChange={handleOrderChange}
                  required
                />

              </div>


              {/* INSTRUCTIONS */}

              <div className="form-group">

                <label>
                  Delivery Instructions
                  <span> Optional</span>
                </label>

                <textarea
                  name="instructions"
                  placeholder="Example: Call when you arrive..."
                  value={orderData.instructions}
                  onChange={handleOrderChange}
                />

              </div>


              {/* SUMMARY */}

              <div className="order-summary">

                <div>
                  <span>Items</span>
                  <strong>
                    {cart.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>₹{totalAmount}</strong>
                </div>

              </div>


              {/* PLACE ORDER */}

              <button
                type="submit"
                className="place-order-btn"
              >
                Place Order
              </button>

            </form>

          </div>

        </div>
      )}


      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {orderPlaced && (
        <div className="order-success">

          <div className="success-icon">
            ✓
          </div>

          <h2>Order Placed Successfully!</h2>

          <p>
            Your order has been sent to Local Restro Cafe.
          </p>

          <button
            onClick={() => setOrderPlaced(false)}
          >
            Continue Browsing
          </button>

        </div>
      )}


      {/* =========================
          MENU HEADER
      ========================= */}

      <div className="menu-header">

        <p className="menu-label">
          LOCAL RESTRO CAFE
        </p>

        <h1>Our Menu</h1>

        <p>
          Crafted with passion, served with elegance.
        </p>

      </div>


      {/* =========================
          STARTERS
      ========================= */}

      <section className="menu-category">

        <h2>Starters</h2>


        <div className="menu-item">

          <div>

            <h3>Chicken Tikka</h3>

            <p>
              Tender chicken marinated in aromatic spices.
            </p>

          </div>


          <div>

            <p className="menu-price">
              ₹299
            </p>

            <button
              className="add-order-btn"
              onClick={() =>
                addToOrder({
                  name: "Chicken Tikka",
                  price: 299,
                })
              }
            >
              Add to Order
            </button>

          </div>

        </div>


        <div className="menu-item">

          <div>

            <h3>Paneer Tikka</h3>

            <p>
              Grilled cottage cheese with Indian spices.
            </p>

          </div>


          <div>

            <p className="menu-price">
              ₹249
            </p>

            <button
              className="add-order-btn"
              onClick={() =>
                addToOrder({
                  name: "Paneer Tikka",
                  price: 249,
                })
              }
            >
              Add to Order
            </button>

          </div>

        </div>

      </section>


      {/* =========================
          MAIN COURSE
      ========================= */}

      <section className="menu-category">

        <h2>Main Course</h2>


        <div className="menu-item">

          <div>

            <h3>Grilled Steak</h3>

            <p>
              Juicy grilled steak served with our signature sides.
            </p>

          </div>


          <div>

            <p className="menu-price">
              ₹599
            </p>

            <button
              className="add-order-btn"
              onClick={() =>
                addToOrder({
                  name: "Grilled Steak",
                  price: 599,
                })
              }
            >
              Add to Order
            </button>

          </div>

        </div>


        <div className="menu-item">

          <div>

            <h3>Creamy Pasta</h3>

            <p>
              Rich creamy pasta finished with herbs and parmesan.
            </p>

          </div>


          <div>

            <p className="menu-price">
              ₹399
            </p>

            <button
              className="add-order-btn"
              onClick={() =>
                addToOrder({
                  name: "Creamy Pasta",
                  price: 399,
                })
              }
            >
              Add to Order
            </button>

          </div>

        </div>

      </section>


      {/* =========================
          DESSERTS
      ========================= */}

      <section className="menu-category">

        <h2>Desserts</h2>


        <div className="menu-item">

          <div>

            <h3>Chocolate Dessert</h3>

            <p>
              Decadent chocolate dessert for the perfect ending.
            </p>

          </div>


          <div>

            <p className="menu-price">
              ₹299
            </p>

            <button
              className="add-order-btn"
              onClick={() =>
                addToOrder({
                  name: "Chocolate Dessert",
                  price: 299,
                })
              }
            >
              Add to Order
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Menu;