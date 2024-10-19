import React from "react";
import {Routes, Route} from "react-router-dom";
import Home from "./scenes/home";
import Navbar from "./components/navbar";
import Signup from "./scenes/signup";
import Login from "./scenes/login";
import Dashboard from "./scenes/dashboard";


import { createTheme, themeProvider} from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import CssBaseline from '@mui/material/CssBaseline';




const theme = createTheme({
  palette: {
    primary:{
      main: '#282525',
    },
    secondary:{
      main: '#D9D9D9',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        

      
      </Routes>

    </ThemeProvider>
    
    
  );
}

export default App;
