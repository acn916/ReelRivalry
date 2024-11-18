import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import { useAuth } from '../../AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Profile = () => {

    const {userEmail, userFirstName, userLastName, loading} = useAuth();


    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
                height: '100vh'
            }}
        >
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    
                }}
            >
                <Box
                    sx={{
                        display: 'flex', 
                        justifyContent: 'center',
                        backgroundColor: 'secondary.main',
                        flexDirection: 'column',
                        width: '100%',
                        mt: '40px'
                    }}
                >

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent:'center',
                            pt: 3
                        }}
                    >
                        <AccountCircleIcon 
                            sx={{
                                height: '36px',
                                width: '36px',
                                
                            }}
                        
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 2
                        }}
                    >
                        <Typography id='users-full-name'>{`${userFirstName} ${userLastName}`}</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            p: 2
                        }}
                    >
                            <Typography id="users-email">{userEmail}</Typography>
                    </Box>


                </Box>
                
                



            </Container>
        </Box>
    )
}

export default Profile