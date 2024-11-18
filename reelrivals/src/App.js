import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./scenes/home";
import Navbar from "./components/navbar";
import Signup from "./scenes/signup";
import Login from "./scenes/login";
import Dashboard from "./scenes/dashboard";
import CreateTournament from "./scenes/createTournament";
import TournamentInfo from "./scenes/tournamentInfo";
import UserTournaments from "./scenes/userTournaments";
import { useAuth, AuthProvider } from "./AuthContext";
import { TournamentProvider } from "./TournamentContext"; // Import TournamentProvider

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


import './App.css';
import Profile from "./scenes/profile";

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  palette: {
    primary: {
      main: '#8d99ae',
    },
    secondary: {
      main: '#dbdbd9',
    },
    third: {
      main: '#dbdbd9',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1280,
      xl: 1920,
    },
  },
});

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        
        <TournamentProvider> {/* Wrap with TournamentProvider */}
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/create-tournament" element={<PrivateRoute><CreateTournament /></PrivateRoute>} />
            <Route path="/tournament/:tournamentId" element={<PrivateRoute><TournamentInfo /></PrivateRoute>} />
            <Route path="/my-tournaments" element={<PrivateRoute><UserTournaments /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
          </Routes>
        </TournamentProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
