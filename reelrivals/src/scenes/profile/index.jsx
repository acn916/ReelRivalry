import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../AuthContext';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebaseConfig';
import axios from 'axios';

const Profile = () => {
    const { userEmail, userFirstName, userLastName, userId, userPicture, setUserPicture, loading } = useAuth();
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [preview, setPreview] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const handleImageChange = (event) => {
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
            setProfileImageUrl(url);
            setUserPicture(url);

            const response = await axios.patch(`${apiBaseUrl}/user/picture/${userId}`, { "picture": url });
            console.log('Upload Success:', response.data);
        } catch (error) {
            console.error('Upload Error:', error);
        } finally {
            setImageLoading(false);
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
        <Box sx={{ backgroundColor: 'primary.main', height: '200vh' }}>
            <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '100%',
                        mt: '40px',
                        backgroundColor: 'secondary.main',
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

                    <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography id="users-full-name" variant="h5">
                            {`${userFirstName} ${userLastName}`}
                        </Typography>
                        <Typography id="users-email" variant="subtitle1">
                            {userEmail}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        {imageLoading ? (
                            <Typography variant="subtitle1">Uploading...</Typography>
                        ) : (
                            <>
                                <Button
                                    variant="contained"
                                    component="label"
                                    color="secondary"
                                >
                                    Upload Profile Picture
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                                {profileImage && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleImageUpload}
                                    >
                                        Save Changes
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Profile;
