import React from "react";
import {Routes, Route} from "react-router-dom";
import Home from "./scenes/home";
import Navbar from "./components/navbar";
import Signup from "./scenes/signup";
import Login from "./scenes/login";
import Dashboard from "./scenes/dashboard";
import CreateTournament from "./scenes/createTournament";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";


import { createTheme, themeProvider} from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from "./AuthContext";

  const theme = createTheme({
      palette: {
          primary:{
            main: '#282525',
          },
          secondary:{
            main: '#D9D9D9',
          },
          third:{
            main: '#919191'
          }
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
              <CssBaseline/>
              <Navbar/>
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/signup" element={<Signup/>}/>


                <Route path="/login" element={<Login/>}/>
                <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
                <Route path="/create-tournaments" element={<PrivateRoute><CreateTournament/></PrivateRoute>}/>
                

              
              </Routes>

          </ThemeProvider>

      </AuthProvider>
          
      
      
    );
}

export default App;
