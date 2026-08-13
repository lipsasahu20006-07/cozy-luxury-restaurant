import { useNavigate } from "react-router-dom";
import "../App.css";
import { useState } from "react";
console.log("HOME CSS LOADED");

import heroImage from "../assets/Images/food.jpg";
import food1 from "../assets/Images/Food.1.jpg";
import food2 from "../assets/Images/food.2.jpg";
import food3 from "../assets/Images/Food.3.jpg";
import aboutImage from "../assets/Images/about.jpg";

import gallery1 from "../assets/Images/gallery1.jpg";
import gallery2 from "../assets/Images/gallery2.jpg";
import gallery3 from "../assets/Images/gallery3.jpg";
import gallery4 from "../assets/Images/gallery4.jpg";
import gallery5 from "../assets/Images/gallery5.jpg";
import gallery6 from "../assets/Images/gallery6.jpg";

import customer1 from "../assets/Images/costumer.jpg";
import customer2 from "../assets/Images/costumer2.jpg";
import customer3 from "../assets/Images/costumer3.jpg";


function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://cozy-luxury-restaurant-1.onrender.com/api/reserve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert(data.message);

      setFormData({
        name: "",
        email: "",
        phone: "",
        guests: "",
        date: "",
        time: "",
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <main id="home" className="hero">

      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo">LOCAL RESTRO CAFE</h2>

        <ul className="nav-links">
  <li onClick={() => navigate("/")}>Home</li>

  <li onClick={() => navigate("/menu")}>Menu</li>

  <li onClick={() =>
    document.getElementById("about").scrollIntoView({
      behavior: "smooth",
    })
  }>
    About
  </li>

  <li onClick={() =>
    document.getElementById("contact").scrollIntoView({
      behavior: "smooth",
    })
  }>
    Contact
  </li>
</ul>

        <button
  className="book-btn"
  onClick={() =>
    document.getElementById("contact").scrollIntoView({
      behavior: "smooth",
    })
  }
>
  Book Table
</button>
      </nav>


      {/* HERO */}
      <section className="hero-content">

        <div className="left">
          <p className="tagline">
            Fine Dining • Premium Experience
          </p>

          <h1>
            Every Meal <br />
            Tells A Story
          </h1>

          <p className="description">
            Experience handcrafted dishes, elegant ambience,
            and unforgettable moments in the heart of Palasunie.
          </p>

          <button
  className="explore-btn"
  onClick={() => navigate("/menu")}
>
  Explore Menu
</button>
        </div>

        <div className="right">
          <img
            src={heroImage}
            alt="Delicious Food"
          />
        </div>

      </section>


      {/* CHEF'S SPECIAL */}
      <section className="special-menu">

        <h2>Chef's Special</h2>

        <p className="special-text">
          Crafted with passion, served with elegance.
        </p>

        <div className="food-cards">

          <div className="card">
            <img src={food1} alt="Steak" />
            <h3>Grilled Steak</h3>
            <p>₹599</p>
          </div>

          <div className="card">
            <img src={food2} alt="Pasta" />
            <h3>Creamy Pasta</h3>
            <p>₹399</p>
          </div>

          <div className="card">
            <img src={food3} alt="Dessert" />
            <h3>Chocolate Dessert</h3>
            <p>₹299</p>
          </div>

        </div>

      </section>


      {/* ABOUT */}
      <section id="about" className="about">

        <div className="about-image">
          <img
            src={aboutImage}
            alt="Restaurant Interior"
          />
        </div>

        <div className="about-content">

          <p className="about-tag">
            ABOUT US
          </p>

          <h2>
            Where Every Meal
            <br />
            Becomes A Memory
          </h2>

          <p className="about-text">
            At Local Restro Cafe, we combine fresh ingredients,
            elegant ambience, and exceptional hospitality to
            create a truly unforgettable dining experience.
            Every dish is prepared with passion and served
            with love.
          </p>

          <button className="about-btn">
            Read More
          </button>

        </div>

      </section>


      {/* GALLERY */}
      <section className="gallery">

        <h2>Our Gallery</h2>

        <p className="gallery-text">
          Discover the flavours, ambience and moments that
          make every visit unforgettable.
        </p>

        <div className="gallery-grid">

          <img src={gallery1} alt="Gallery 1" />
          <img src={gallery2} alt="Gallery 2" />
          <img src={gallery3} alt="Gallery 3" />
          <img src={gallery4} alt="Gallery 4" />
          <img src={gallery5} alt="Gallery 5" />
          <img src={gallery6} alt="Gallery 6" />

        </div>

      </section>


      {/* TESTIMONIALS */}
      <section className="testimonials">

        <h2>What Our Customers Say</h2>

        <p className="testimonial-text">
          We love creating memorable dining experiences for every guest.
        </p>

        <div className="testimonial-cards">

          <div className="testimonial-card">
            <img src={customer1} alt="Customer 1" />

            <h3>Emily Johnson</h3>

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "The ambience was amazing and the food was absolutely delicious.
              I will definitely visit again!"
            </p>
          </div>


          <div className="testimonial-card">
            <img src={customer2} alt="Customer 2" />

            <h3>David Miller</h3>

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "Excellent service, beautiful interior, and every dish was full
              of flavour. Highly recommended!"
            </p>
          </div>


          <div className="testimonial-card">
            <img src={customer3} alt="Customer 3" />

            <h3>Sophia Wilson</h3>

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "One of the best restaurants I've visited. A perfect place for
              family dinners and special occasions."
            </p>
          </div>

        </div>

      </section>


      {/* RESERVATION */}
      <section id="contact" className="reservation">

        <h2>Book a Table</h2>

        <p className="reservation-text">
          Reserve your table and enjoy an unforgettable dining experience.
        </p>

        <form
          className="reservation-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <button type="submit">
            Reserve Now
          </button>

        </form>

      </section>


      {/* FOOTER */}
      <footer className="footer">

        <h2>LOCAL RESTRO CAFE</h2>

        <p>
          Experience luxury dining with unforgettable flavours.
        </p>

        <div className="footer-info">

          <div>
            <h3>Address</h3>
            <p>Palasunie, Bhubaneswar, Odisha</p>
          </div>

          <div>
            <h3>Phone</h3>
            <p>+91 00005 00070</p>
          </div>

          <div>
            <h3>Email</h3>
            <p>localrestrocafe@gmail.com</p>
          </div>

        </div>

        <p className="copyright">
          © 2026 Local Restro Cafe. All Rights Reserved.
        </p>

      </footer>

    </main>
  );
}

export default Home;