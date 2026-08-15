import "./AdminLogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  try {
    const response = await fetch(
  "https://cozy-luxury-backend.onrender.com/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid email or password.");
      return;
    }

    localStorage.setItem("adminToken", data.token);

    navigate("/admin");
  } catch (error) {
    console.error("Login error:", error);
    alert("Unable to connect to server.");
  }
};

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-logo">
          LOCAL RESTRO CAFE
        </div>

        <p className="admin-label">OWNER PORTAL</p>

        <h1>Welcome Back</h1>

        <p className="admin-subtitle">
          Sign in to manage your restaurant
        </p>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="admin-login-btn">
            Sign In
          </button>

        </form>

        <p className="admin-footer">
          Restaurant Management System
        </p>

      </div>
    </div>
  );
}

export default AdminLogin;