import React, { useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../AuthContext';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebaseConfig';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoIcon from '@mui/icons-material/Photo';
import axios from 'axios';

const Profile = () => {
    const { userEmail, userFirstName, userLastName, userId, userPicture, setUserPicture, loading } = useAuth();
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [openChooseImage, setOpenChooseImage] = useState(false);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const handleChooseImage = () => setOpenChooseImage(!openChooseImage)
    const handleImageDelete = () => {
        setPreview(null);
        setOpenChooseImage(false);
    }

    const handleImageChange = (event) => {
        setOpenChooseImage(true);
        const file = event.target.files[0];
        if (file) {
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!profileImage) return;

        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${userId}/${Date.now()}`);
        setImageLoading(true);

        try {
            await uploadString(storageRef, profileImage, 'data_url');
            const url = await getDownloadURL(storageRef);
            setUserPicture(url);

            await axios.patch(`${apiBaseUrl}/user/picture/${userId}`, { "picture": url });
        } catch (error) {
            console.error('Upload Error:', error);
        } finally {
            setImageLoading(false);
            setOpenChooseImage(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: 'primary.main',
                }}
            >
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: 'primary.main', height: '140vh' }}>
            <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        
                        width: '100%',
                        mt: '40px',
                        backgroundColor: 'secondary.main',
                        height: '130vh',
                        borderRadius: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            height: { xs: '500px', sm: '700px' },
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                }}
                            />
                        ) : userPicture ? (
                            <img
                                src={userPicture}
                                alt="Profile"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                }}
                            />
                        ) : (
                            <AccountCircleIcon fontSize="large" />
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        {imageLoading ? (
                            <CircularProgress/>
                        ) : (
                            <>
                                
                                <IconButton onClick={() => {document.getElementById('image-upload').click(); preview == null && handleChooseImage()}}>
                                    <PhotoIcon />
                                </IconButton>
                                <input
                                    type="file"
                                    id="image-upload"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
/>
                                
                                
                                {openChooseImage && (
                                    <React.Fragment>
                                        <IconButton onClick={handleImageUpload}>
                                            <TaskAltIcon fontSize="medium"/>
                                        </IconButton>

                                        <IconButton onClick={handleImageDelete}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    
                                    </React.Fragment>
                                    
                                   
                                )}
                            </>
                        )}
                    </Box>

                    <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography fontWeight="bold" id="users-full-name" variant="h4">
                            {`${userFirstName} ${userLastName}`}
                        </Typography>
                        <Typography id="users-email" variant="subtitle1">
                            {userEmail}
                        </Typography>
                    </Box>


                    

                    
                    <Box
                        sx={{
                            display: 'flex', 
                            justifyContent: 'center',
                            mt: 3
                        }}
                    
                    >
                        <Typography variant="h4" fontWeight="bold">Stats</Typography>
                    </Box>
                    
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box
                            sx={{
                                display:'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                width: '100%',
                               
                                pl: 1
                            }}
                        
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%',
                                }}
                            >

                                <Typography fontWeight="bold" variant='h5'>Tournaments</Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: 1,
                                    textAlign: 'center',
                                }}
                            >
                                <Typography fontWeight="bold">Total Wins:</Typography>
                                <Typography fontWeight="bold">Total Tournaments:</Typography>

                            </Box>

                            
                        </Box>
                        <Box
                            sx={{
                                display:'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                width: '100%',
                                pl: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%'
                                }}
                            >
                                <Typography fontWeight="bold" variant="h5">Fish</Typography>
                            </Box>
                            <Box 
                            
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: 1,
                                    textAlign: 'center',
                                }}
                            >
                                <Typography fontWeight="bold">Total Caught:</Typography>
                                <Typography fontWeight="bold">Largest Fish:</Typography>
                            </Box>
                        
                        </Box>

                    </Box>

                </Box>
            </Container>
        </Box>
    );
};

export default Profile;
