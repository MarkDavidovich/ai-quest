import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import GamePage from "./pages/GamePage/GamePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import MenuPage from "./pages/MenuPage/MenuPage";
import { useAuth } from "./context/AuthContext";

function App({ routeLocation }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1b1e",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        Loading quest...
      </div>
    );
  }

  return (
    <Routes location={routeLocation}>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/menu" replace /> : <AuthPage />} 
      />
      <Route 
        path="/menu" 
        element={isAuthenticated ? <MenuPage /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/game" 
        element={isAuthenticated ? <GamePage /> : <Navigate to="/" replace />} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
