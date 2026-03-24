import { useState, useEffect } from "react";
import "./App.css";
import GamePage from "./pages/GamePage/GamePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#1a1b1e',
        color: 'white',
        fontFamily: 'sans-serif'
      }}>
        Loading quest...
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <GamePage />
      ) : (
        <AuthPage />
      )}
    </>
  );
}

export default App;
