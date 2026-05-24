import { useState } from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";

function App() {
  const savedEmail = localStorage.getItem("userEmail");
  const [page, setPage] = useState(savedEmail ? "dashboard" : "login");
  const [userEmail, setUserEmail] = useState(savedEmail || "");

  function handleLoginSuccess(email) {
    setUserEmail(email);
    setPage("dashboard");
  }

  function handleRegisterSuccess(email) {
    setUserEmail(email);
    setPage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("userEmail");
    setUserEmail("");
    setPage("login");
  }

  if (page === "dashboard") {
    return <DashboardPage userEmail={userEmail} onLogout={handleLogout} />;
  }

  if (page === "register") {
    return (
      <RegisterPage
        onGoToLogin={() => setPage("login")}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  return (
    <LoginPage
      onGoToRegister={() => setPage("register")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;
