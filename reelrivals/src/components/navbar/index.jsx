import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, MenuItem, Typography, Menu, IconButton, Avatar, Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Undo from '@mui/icons-material/Undo';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../AuthContext';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const {logout} = useAuth();
    
    // State for handling menu open/close
    const [anchorEl, setAnchorEl] = useState(null);
    const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);

    const avatarOpen = Boolean(avatarAnchorEl);
    const open = Boolean(anchorEl);

    // Function to open menu
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Function to close menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAvatarOpen = (event) => {
        setAvatarAnchorEl(event.currentTarget);
    };

    const handleAvatarClose = () => {
        setAvatarAnchorEl(null);
    }

    const handleSignOut = () => {
        logout();
    }

    const titleClick = () =>{
        navigate('/dashboard');
    }

    // Handlers for navigation
    const loginClick = () => {
        navigate('/login');
    };

    const undoClick = () => {
        navigate('/');
    };

    const isAuthPage = location.pathname === '/' || location.pathname === '/login';

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
                
                <IconButton id="return-button" onClick={undoClick}>
                    <Undo />
                </IconButton>
                
            )}
            

            {!isAuthPage && (
                <>
                    {/* Menu icon with dropdown menu */}
                    <IconButton id="menu-button" onClick={handleMenuOpen}>
                        <MenuIcon />
                    </IconButton>

                    {/* Menu for dropdown */}
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                    >
                        <MenuItem id="my-tournament-option" onClick={() => { navigate('/my-tournaments'); handleMenuClose(); }}>My Tournaments</MenuItem>
                        <MenuItem id="create-tournament-option"onClick={() => { navigate('/create-tournaments'); handleMenuClose(); }}>Create Tournaments</MenuItem>
                        <MenuItem id="settings-option"onClick={() => { navigate('/settings'); handleMenuClose(); }}>Settings</MenuItem>
                    </Menu>
                </>
            )}

            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>

                <Button id="title-button" onClick={titleClick}>
                    <Typography variant='h4' align='center'>
                        ReelRivals
                    </Typography>
                </Button>
                
            </Box>

            {!isAuthPage && (
                <>
                    {/* still need to implement notifcations */}
                    <IconButton id="notification-button">
                        <NotificationsIcon />
                    </IconButton>

                    
                    <IconButton id="avatar-icon-button"onClick={handleAvatarOpen}>
                        <Avatar sx={{ width: 24, height: 24 }} />
                    </IconButton>
                    <Menu
                        anchorEl={avatarAnchorEl}
                        open={avatarOpen}
                        onClose={handleAvatarClose}
                    >
                        <MenuItem id="sign-out-option" onClick={() => {handleAvatarClose(); handleSignOut(); navigate('/login') }}>Sign Out</MenuItem>
                        
                    </Menu>
                    
                </>
            )}

            {location.pathname === '/' && (
                <IconButton id="login-button" onClick={loginClick}>
                    <LoginIcon />
                </IconButton>
            )}
        </Box>
    )
}

export default Navbar;
