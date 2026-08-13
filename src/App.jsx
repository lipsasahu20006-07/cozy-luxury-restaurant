import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import AdminLogin from "./AdminLogin";
import Menu from "./pages/Menu";
import Admin from "./Admin";
import AdminOrders from "./AdminOrders";
import AdminMenu from "./AdminMenu";

function ProtectedAdmin() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn");

  if (!isLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Admin />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* CUSTOMER WEBSITE */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/menu"
          element={<Menu />}
        />


        {/* ADMIN LOGIN */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin"
          element={<ProtectedAdmin />}
        />


        {/* ADMIN ORDERS */}

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />


        {/* ADMIN MENU MANAGEMENT */}

        <Route
          path="/admin/menu"
          element={<AdminMenu />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;