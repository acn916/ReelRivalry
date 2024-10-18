import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import Undo from '@mui/icons-material/Undo';

function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();

    const loginClick = () => {
        console.log("login button clicked");
       // alert("Login button clicked");
        navigate('/login');
    }

    const undoClick = () => {
        console.log("undo button clicked");
        //alert("Undo button clicked");
        navigate('/');
    }

    return (
        <Box
        
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                backgroundColor: 'secondary.main',
            }}
        >
            {location.pathname === '/login' && (
                <IconButton onClick={undoClick}>
                    <Undo/>
                </IconButton>
            )}
            
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Typography variant='h4' align='center'>
                    ReelRivals
                </Typography>
            </Box>
            {location.pathname === '/' && (
                <IconButton  onClick={loginClick}>
                    <LoginIcon />
                </IconButton>
            )}

        </Box>
    )
}

export default Navbar;