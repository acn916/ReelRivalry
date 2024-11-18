import React, {useState, useEffect, useRef} from 'react';
import { Box, IconButton, Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import dayjs from 'dayjs';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { keyframes } from '@mui/system';

const NotificationsDropDown = ({invitations, handleAcceptInvitation, handleDeleteInvitation}) => {

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref to the dropdown container
    
    const toggleDropdown = () => {
        setOpen((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        // Check if the click is outside the dropdown container
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        // Add event listener for clicks outside the dropdown
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const bounce = keyframes`
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
        `;

    return (
        <Box>
            {invitations.length > 0 ? (
                <IconButton onClick={toggleDropdown}>
                    <NotificationsActiveIcon 
                        sx={{
                            color:"#f23a46",
                            animation: `${bounce} 0.6s infinite`,
                        }}/>
                </IconButton>
            ):(
                <IconButton onClick={toggleDropdown}>
                    <NotificationsIcon/>
                </IconButton>
            )}
            
            {open && (
                <Box
                    ref={dropdownRef} // Attach ref to dropdown container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'absolute',
                        backgroundColor: '#fff',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        mt: '1px',
                       
                        right: 0,
                        width: 'auto',
                        minWidth: '200px',
                        transform: {
                            xs: 'translateX(-50px)', // Small screens (mobile)
                            md: 'translateX(-100px)',  // Medium and larger screens (desktop)
                        },                        
                        zIndex: 1,
                    }}
                >
                    {invitations.map((invitation, index) => (
                        <Box
                            id="column-boxes"
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px',
                                borderBottom: index !== invitations.length - 1 ? '1px solid #e0e0e0' : 'none',
                                width: '100%'
                            }}
                        >

                            <Grid sx={{width: '100%'}}>
                                <Grid xs={12}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%',
                                            p: '2px',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        
                                        <Typography fontWeight="bold">{invitation.tournamentName}</Typography>
                                        {invitation.status === 'Ongoing' ? 
                                            <Typography fontSize='12px' color="green">Ongoing</Typography>
                                            :
                                            invitation.status === 'Upcoming' ?
                                            <Typography fontSize='12px' color="orange">Upcoming</Typography>
                                            :
                                            <Typography fontSize='12px' color='red'>Finished</Typography>
                                        }
                                    </Box>
                                </Grid>
                                <Grid>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            pt: '1px',
                                            backgroundColor: 'black'
                                        }}
                                    />
                                       
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            width: '100%',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        
                                        <Typography>Date: {dayjs.utc(invitation.startDateTime).local().format('MM-DD-YYYY')}</Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                gap: 2
                                            }}
                                        >
                                            <Typography>Start: {dayjs.utc(invitation.startDateTime).local().format("h:mm A")}</Typography>
                                            <Typography>End: {dayjs.utc(invitation.endDateTime).local().format("h:mm A")}</Typography>

                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid sx={12}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            
                                        }}
                                    >
                                        <IconButton
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleAcceptInvitation(index);
                                            }}
                                        >
                                            <CheckCircleOutlineIcon sx={{color: 'green'}}/>
                                        </IconButton>
                                        <IconButton
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleDeleteInvitation(index);
                                            }}
                                        >
                                            <HighlightOffIcon sx={{color: 'red'}}/>
                                        </IconButton>
                                       

                                    </Box>
                                    
                                </Grid>
                            </Grid>
                           
                           
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    )
}

export default NotificationsDropDown