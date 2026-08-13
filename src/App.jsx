import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./AdminLogin";
import Menu from "./pages/Menu";
import Admin from "./Admin";

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

  <Route path="/" element={<Home />} />

  <Route path="/menu" element={<Menu />} />

  <Route path="/admin-login" element={<AdminLogin />} />

  <Route path="/admin" element={<ProtectedAdmin />} />

</Routes>
    </BrowserRouter>
  );
}

export default App;