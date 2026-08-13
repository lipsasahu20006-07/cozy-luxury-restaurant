import "./Menu.css";
import { useEffect, useState } from "react";

function Menu() {
  const [cart, setCart] = useState([]);

  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  const [showOrderForm, setShowOrderForm] = useState(false);

  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    address: "",
    instructions: "",
  });

  // FETCH MENU FROM DATABASE
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          "https://cozy-luxury-restaurant-1.onrender.com/api/menu"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        const data = await response.json();

        // Show ALL dishes, including unavailable dishes
        setMenuItems(data);
      } catch (error) {
        console.error("Menu fetch error:", error);
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenu();
  }, []);

  // ADD ITEM TO CART
  const addToOrder = (item) => {
    // Don't allow unavailable dishes
    if (item.available === false) {
      return;
    }

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
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  // INCREASE QUANTITY
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

  // DECREASE QUANTITY
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

  // TOTAL AMOUNT
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // ORDER FORM INPUT
  const handleOrderChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
  };

  // PLACE ORDER
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (
      !orderData.name ||
      !orderData.phone ||
      !orderData.address
    ) {
      alert(
        "Please fill in your name, phone number and delivery address."
      );
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
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
            customerName: orderData.name,
            phone: orderData.phone,
            address: orderData.address,
            instructions: orderData.instructions,
            items: cart,
            totalAmount: totalAmount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order."
        );
      }

      alert("🎉 Order placed successfully!");

      setCart([]);

      setOrderData({
        name: "",
        phone: "",
        address: "",
        instructions: "",
      });

      setShowOrderForm(false);
    } catch (error) {
      console.error("Order error:", error);

      alert(
        error.message || "Failed to place order."
      );
    }
  };

  // MENU CATEGORIES
  const categories = [
    "Starters",
    "Main Course",
    "Desserts",
    "Beverages",
  ];

  return (
    <div className="menu-page">

      {/* ORDER BOX */}

      {cart.length > 0 && (
        <div className="order-box">

          <h2>Your Order 🛒</h2>

          {cart.map((item) => (
            <div
              className="order-item"
              key={item.name}
            >

              <span>
                {item.name}
              </span>

              <div className="quantity-controls">

                <button
                  onClick={() =>
                    decreaseQuantity(item.name)
                  }
                >
                  −
                </button>

                <span>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    increaseQuantity(item.name)
                  }
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

            <strong>
              Total
            </strong>

            <strong>
              ₹{totalAmount}
            </strong>

          </div>

          <button
            className="place-order-btn"
            onClick={() =>
              setShowOrderForm(true)
            }
          >
            Place Order
          </button>

        </div>
      )}


      {/* MENU HEADER */}

      <div className="menu-header">

        <p className="menu-label">
          LOCAL RESTRO CAFE
        </p>

        <h1>
          Our Menu
        </h1>

        <p>
          Crafted with passion, served with elegance.
        </p>

      </div>


      {/* LOADING */}

      {loadingMenu ? (

        <div className="menu-category">

          <h2>
            Loading Menu...
          </h2>

          <p>
            Please wait while we prepare our menu.
          </p>

        </div>

      ) : menuItems.length === 0 ? (

        <div className="menu-category">

          <h2>
            Menu Coming Soon
          </h2>

          <p>
            Our delicious dishes will be available shortly.
          </p>

        </div>

      ) : (

        /* MENU CATEGORIES */

        categories.map((category) => {

          const categoryItems = menuItems.filter(
            (item) => item.category === category
          );

          if (categoryItems.length === 0) {
            return null;
          }

          return (
            <section
              className="menu-category"
              key={category}
            >

              <h2>
                {category}
              </h2>

              {categoryItems.map((item) => {

                const unavailable =
                  item.available === false;

                return (
                  <div
                    className={`menu-item ${
                      unavailable
                        ? "menu-item-unavailable"
                        : ""
                    }`}
                    key={item._id}
                  >

                    <div>

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.description}
                      </p>

                      {unavailable && (
                        <span className="unavailable-label">
                          Currently Unavailable
                        </span>
                      )}

                    </div>

                    <div>

                      <p className="menu-price">
                        ₹{item.price}
                      </p>

                      {unavailable ? (

                        <button
                          className="add-order-btn unavailable-btn"
                          disabled
                        >
                          Unavailable
                        </button>

                      ) : (

                        <button
                          className="add-order-btn"
                          onClick={() =>
                            addToOrder(item)
                          }
                        >
                          Add to Order
                        </button>

                      )}

                    </div>

                  </div>
                );
              })}

            </section>
          );
        })
      )}


      {/* ORDER FORM */}

      {showOrderForm && (

        <div className="order-form-section">

          <div className="order-form-box">

            <button
              className="close-order"
              onClick={() =>
                setShowOrderForm(false)
              }
            >
              ×
            </button>

            <h2>
              Complete Your Order
            </h2>

            <p>
              Enter your delivery details.
            </p>


            <form onSubmit={handlePlaceOrder}>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={orderData.name}
                onChange={handleOrderChange}
              />


              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={orderData.phone}
                onChange={handleOrderChange}
              />


              <textarea
                name="address"
                placeholder="Delivery Address"
                value={orderData.address}
                onChange={handleOrderChange}
              />


              <textarea
                name="instructions"
                placeholder="Special Instructions (Optional)"
                value={orderData.instructions}
                onChange={handleOrderChange}
              />


              <div className="order-summary">

                <strong>
                  Total
                </strong>

                <strong>
                  ₹{totalAmount}
                </strong>

              </div>


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

    </div>
  );
}

export default Menu;