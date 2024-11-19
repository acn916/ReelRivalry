import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, MenuItem, Typography, Menu, IconButton, Avatar, Button, useMediaQuery, CircularProgress } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Undo from '@mui/icons-material/Undo';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../AuthContext';
import axios from 'axios';
import NotificationsDropDown from './NotificationsDropDown';
import { useTournament } from '../../TournamentContext';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)');
    const {logout, userId, userPicture} = useAuth();
    const [invitations, setInvitations] = useState([]);
    
    // State for handling menu open/close
    const [anchorEl, setAnchorEl] = useState(null);
    const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const {setTournaments, setIsUpdated} = useTournament();

    const avatarOpen = Boolean(avatarAnchorEl);
    const open = Boolean(anchorEl);

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

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


    const handleUndoClick = () => {
        navigate('/');
    }

    const handleLoginClick = () => {
        navigate('/login');
    }
    const handleTitleClick = () => {
        navigate('/dashboard');
    };

    const isAuthPage = location.pathname === '/' || location.pathname === '/login';



    const handleRetrieveInvitations = async (userId) => {

        setLoading(true);
        
        try{
            const response = await axios.get(`${apiBaseUrl}/invitation/user/${userId}`);
            setInvitations(response.data);

        } catch (error) {
            console.error(error, "Error retrieving invitations");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptInvitation = async (index) => {
        const data = {
            "userId": userId,
            "tournamentId": invitations[index].tournamentId
        }
        try{
            await axios.post(`${apiBaseUrl}/participant`, data);
            const tourneyResponse = await axios.get(`${apiBaseUrl}/tournament/${invitations[index].tournamentId}`)
            const tourneyData = tourneyResponse.data
            const tourney = {
                "id": tourneyData.id,
                "name": tourneyData.name,
                "date": tourneyData.date,
                "startTime": tourneyData.startTime,
                "endTime": tourneyData.endTime,
                "duration": tourneyData.duration,
                "startDateTime": tourneyData.startDateTime,
                "endDateTime": tourneyData.endDateTime,
                "species": tourneyData.species,
                "status": tourneyData.status,
                "userId": tourneyData.userId,
            }
            setTournaments((prevTournaments) => [...prevTournaments, tourney]);
            setIsUpdated(true);

            handleDeleteInvitations(index);

        } catch (error) {
            console.error(error, "Error accepting invitation");
        }
    }

    const handleDeleteInvitations = async (index) => {
        try{
            await axios.delete(`${apiBaseUrl}/invitation/${invitations[index].id}`)
            setInvitations((prev) => prev.filter((p) => p.id !== invitations[index].id));

        } catch (error) {
            console.error(error, "Error deleting invitation");
        }
    }

    useEffect(() => {
        if(userId){
            handleRetrieveInvitations(userId);
        }
        
    }, [userId]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100vw', 
                backgroundColor: '#dbdbd9'
            }}
        >

            
                {/* Menu Icon */}
            <Box
                sx={{
                    
                    justifyContent: 'center',
                    alignItems: 'center',
                    ml: isMobile ? 0 : 5

                }}
            >

                {!isAuthPage ? (
                    <Box>
                        <IconButton id="menu-button" onClick={handleMenuOpen}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                            >
                                <MenuItem id="my-tournament-option" onClick={() => { navigate('/my-tournaments'); handleMenuClose(); }}>My Tournaments</MenuItem>
                                <MenuItem id="create-tournament-option"onClick={() => { navigate('/create-tournament'); handleMenuClose();}}>Create Tournament</MenuItem>
                        </Menu>
                    </Box>
                    
                ):(
                    <Box>
                        <IconButton onClick={handleUndoClick}>
                            <Undo/>
                        </IconButton>
                    </Box>
                )}
                

            </Box>
            {/* WEBSITE TITLE */}
            <Box
                sx={{
                    width: '100%',
                    textAlign: 'center',

                }}
            >
                <Button onClick={handleTitleClick}>
                    <Typography fontFamily="'Nosifer', sans-serif" color="black" variant="h5" align="center" 
                    sx={{
                        ml:{xs: '30px', lg:'50px'}
                    }}>
                        ReelRivalry
                    </Typography>
                </Button>
                
            </Box>
            {/* NOTIFICATIONS AND AVATAR */}

            <Box
                sx={{
                    mr: !isMobile ? 2 : 0
                }}
            >
                {!isAuthPage &&
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: isMobile ? 0 : 2,
                        }}
                    >

                        <Box>
                            <NotificationsDropDown 
                                invitations={invitations}
                                handleAcceptInvitation={handleAcceptInvitation}
                                handleDeleteInvitation={handleDeleteInvitations}
                            />
                        </Box>
                        

                        <Box
                        >
                            {!loading ? (
                                <IconButton id="avatar-icon" onClick={handleAvatarOpen}>
                                    <Avatar src={userPicture} alt="Profile" sx={{width: '36px', height: '36px'}}/>
                                </IconButton>
                            ):(
                                <CircularProgress/>
                            )}
                            

                            <Menu
                                anchorEl={avatarAnchorEl}
                                open={avatarOpen}
                                onClose={handleAvatarClose}
                                id="right-menu"
                            >
                                <MenuItem id="user-option" onClick={() => {handleAvatarClose(); navigate('/profile')}}>Profile</MenuItem>
                                <MenuItem id="sign-out-option" onClick={() => {handleAvatarClose(); handleSignOut(); navigate('/login') }}>Sign Out</MenuItem>
                                
                            </Menu>
                            
                        </Box>
                    </Box>
                }
            </Box>
            
            <Box
                 sx={{
                    
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: isMobile ? 0 : 5

                }}
            >
                {isAuthPage &&
                    <Box
                        
                    >
                        <IconButton onClick={handleLoginClick}>
                            <LoginIcon/>
                        </IconButton>
                    </Box>
                }   

            </Box>
                  
        </Box>
    )
}

export default Navbar;
