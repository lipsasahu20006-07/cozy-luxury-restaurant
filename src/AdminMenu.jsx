import "./AdminMenu.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminMenu() {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Starters",
    image: "",
    available: true,
  });

  // Protect admin page
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      navigate("/admin-login");
    }
  }, [navigate]);

  // Fetch menu
  const fetchMenu = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://cozy-luxury-restaurant-1.onrender.com/api/menu"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch menu");
      }

      const data = await response.json();

      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Open add form
  const handleAddDish = () => {
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Starters",
      image: "",
      available: true,
    });

    setShowForm(true);
  };

  // Open edit form
  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image || "",
      available: item.available,
    });

    setShowForm(true);
  };

  // Save dish
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price
    ) {
      alert("Please fill in the dish name, description and price.");
      return;
    }

    try {
      const url = editingId
        ? `https://cozy-luxury-restaurant-1.onrender.com/api/menu/${editingId}`
        : "https://cozy-luxury-restaurant-1.onrender.com/api/menu";

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save menu item."
        );
      }

      alert(
        editingId
          ? "Dish updated successfully!"
          : "Dish added successfully!"
      );

      setShowForm(false);
      setEditingId(null);

      await fetchMenu();
    } catch (error) {
      console.error("Menu save error:", error);

      alert(error.message || "Failed to save dish.");
    }
  };

  // Delete dish
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this dish?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://cozy-luxury-restaurant-1.onrender.com/api/menu/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete dish."
        );
      }

      alert("Dish deleted successfully!");

      setMenuItems((current) =>
        current.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Delete menu error:", error);

      alert(error.message || "Failed to delete dish.");
    }
  };

  // Toggle availability
  const handleAvailability = async (item) => {
    try {
      const response = await fetch(
        `https://cozy-luxury-restaurant-1.onrender.com/api/menu/${item._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            available: !item.available,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update availability."
        );
      }

      setMenuItems((current) =>
        current.map((menuItem) =>
          menuItem._id === item._id ? data : menuItem
        )
      );
    } catch (error) {
      console.error("Availability error:", error);

      alert(
        error.message || "Failed to update availability."
      );
    }
  };

  return (
    <div className="admin-menu-page">

      {/* HEADER */}
      <div className="admin-menu-header">

        <div>
          <p className="dashboard-label">
            MENU MANAGEMENT
          </p>

          <h1>Restaurant Menu</h1>

          <p>
            Add, edit and manage dishes available to customers.
          </p>
        </div>

        <div className="admin-menu-header-buttons">

          <button
            className="back-menu-btn"
            onClick={() => navigate("/admin")}
          >
            ← Dashboard
          </button>

          <button
            className="add-dish-btn"
            onClick={handleAddDish}
          >
            + Add Dish
          </button>

        </div>

      </div>


      {/* ADD / EDIT FORM */}

      {showForm && (

        <div className="menu-form-overlay">

          <div className="menu-form-box">

            <button
              className="close-menu-form"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>

            <p className="dashboard-label">
              {editingId ? "EDIT DISH" : "NEW DISH"}
            </p>

            <h2>
              {editingId
                ? "Edit Menu Item"
                : "Add New Dish"}
            </h2>

            <form onSubmit={handleSubmit}>

              <label>
                Dish Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="e.g. Chicken Tikka"
                value={formData.name}
                onChange={handleChange}
              />


              <label>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Describe the dish..."
                value={formData.description}
                onChange={handleChange}
              />


              <div className="menu-form-row">

                <div>

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    placeholder="299"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                  />

                </div>


                <div>

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >

                    <option value="Starters">
                      Starters
                    </option>

                    <option value="Main Course">
                      Main Course
                    </option>

                    <option value="Desserts">
                      Desserts
                    </option>

                    <option value="Beverages">
                      Beverages
                    </option>

                  </select>

                </div>

              </div>


              <label>
                Image URL
              </label>

              <input
                type="text"
                name="image"
                placeholder="https://..."
                value={formData.image}
                onChange={handleChange}
              />


              <label className="availability-checkbox">

                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />

                <span>
                  Dish is available
                </span>

              </label>


              <button
                type="submit"
                className="save-dish-btn"
              >
                {editingId
                  ? "Save Changes"
                  : "Add Dish"}
              </button>

            </form>

          </div>

        </div>

      )}


      {/* MENU ITEMS */}

      {loading ? (

        <div className="menu-admin-message">

          <div>
            ⏳
          </div>

          <h2>
            Loading menu...
          </h2>

          <p>
            Please wait while we fetch the menu.
          </p>

        </div>

      ) : menuItems.length === 0 ? (

        <div className="menu-admin-message">

          <div>
            🍽️
          </div>

          <h2>
            No dishes yet
          </h2>

          <p>
            Add your first dish using the button above.
          </p>

        </div>

      ) : (

        <div className="admin-menu-grid">

          {menuItems.map((item) => (

            <div
              className={`admin-menu-card ${
                !item.available
                  ? "dish-unavailable"
                  : ""
              }`}
              key={item._id}
            >

              {/* IMAGE */}

              {item.image ? (

                <img
                  src={item.image}
                  alt={item.name}
                  className="admin-menu-image"
                />

              ) : (

                <div className="admin-menu-image-placeholder">
                  🍽️
                </div>

              )}


              {/* CONTENT */}

              <div className="admin-menu-content">

                <div className="admin-menu-card-top">

                  <span className="menu-category-badge">
                    {item.category}
                  </span>

                  <span
                    className={
                      item.available
                        ? "available-badge"
                        : "unavailable-badge"
                    }
                  >
                    {item.available
                      ? "Available"
                      : "Unavailable"}
                  </span>

                </div>


                <h2>
                  {item.name}
                </h2>

                <p>
                  {item.description}
                </p>


                <div className="admin-menu-price">
                  ₹{item.price}
                </div>


                {/* ACTIONS */}

                <div className="admin-menu-actions">

                  <button
                    className="edit-dish-btn"
                    onClick={() => handleEdit(item)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="availability-btn"
                    onClick={() =>
                      handleAvailability(item)
                    }
                  >
                    {item.available
                      ? "🔴 Disable"
                      : "🟢 Enable"}
                  </button>

                  <button
                    className="delete-dish-btn"
                    onClick={() =>
                      handleDelete(item._id)
                    }
                  >
                    🗑️
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminMenu;