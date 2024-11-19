import React, { useState } from 'react';
import { Box, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, CircularProgress } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'
import { app } from '../../../firebaseConfig'; // Ensure this points to your firebase config file
import axios from 'axios';
import dayjs from 'dayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { useAuth } from '../../../AuthContext';


const TournamentHeader = ({ name, status, tournamentId, retrieveParticipants, showDetails, setShowDetails }) => {
    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [fishLength, setFishLength] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [date, setDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);

    const {userId} = useAuth();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setImageSrc('');
        setFishLength('');
        setImageUrl('');
    };

    const handleFishLength = (e) => {
        const length = e.target.value;
        setFishLength(length);
    }

    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    }

    const handleSubmit = async () => {
        if (!imageSrc) return; // Prevent submission if no image is uploaded

        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${Date.now()}`); // Create a unique file name
        setLoading(true);
        try {
            // Upload the image to Firebase Storage
            await uploadString(storageRef, imageSrc, 'data_url');
            // Get the download URL
            const url = await getDownloadURL(storageRef);
            setImageUrl(url); // Save the image URL to state

            const todaysDate = date.utc().format("YYYY-MM-DD");
            const length = parseFloat(fishLength);
            const catchData = {
                "length": length,
                "dateCaught": todaysDate,
                "picture": url,
                "userId": userId,
                "tournamentId": tournamentId
            }

            //console.log("catch data", catchData)
            const response = await axios.post(`${apiBaseUrl}/fish`, catchData);
            //console.log(response);

            retrieveParticipants()
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setLoading(false);
            handleClose(); // Close the dialog after uploading
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  
                    
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    <IconButton onClick={handleShowDetails}>
                        {showDetails ? (
                            <ExpandLessIcon/>
                        ):(
                            <ExpandMoreIcon/>
                        )}
                        
                    </IconButton>

                </Box>
                <Box
                    sx={{
                        minWidth: '200px',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    <Typography fontWeight='bold' variant="h4" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        {name}
                    </Typography>

                </Box>
                
                <Box sx={{  display: 'flex', justifyContent: 'center', width: '100%',marginTop: '5px' }}>
                    <IconButton onClick={handleOpen} disabled={status === 'Previous' || status === 'Upcoming'}>
                        <AddAPhotoIcon />
                    </IconButton>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    height: 'auto',
                }}
            >
                {status === "Ongoing" ? (
                    <Box sx={{ color: 'green' }}>{status} Tournament</Box>
                ) : status === "Upcoming" ? (
                    <Box sx={{ color: 'yellow' }}>{status}</Box>
                ) : (
                    <Box sx={{ color: 'red' }}>Finished</Box>
                )}
            </Box>

            
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Upload Photo</DialogTitle>
                    
                        {!loading ? (
                            <DialogContent>
                                <DialogContentText>
                                    1. Upload fish picture
                                </DialogContentText>
                                <DialogContentText>
                                    2. Enter Fish Length
                                </DialogContentText>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box sx={{display: 'flex', justifyContent: 'flex-start', p:'20px'}}>
                                        <input type="file" accept="image/*" onChange={handleUpload} />
                                    </Box>
                                    
                                    {imageSrc && (
                                        <Box sx={{ marginTop: 2 }}>
                                            <Typography>Uploaded Image:</Typography>
                                            <img src={imageSrc} alt="Uploaded" style={{ width: '100%', marginTop: 5 }} />
                                            <TextField 
                                                value={fishLength}
                                                label="Fish Length"
                                                type='number'
                                                onChange={handleFishLength}
                                                sx={{
                                                    mt: '10px'
                                                }}
                                                fullWidth
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </DialogContent>

                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '300px',
                                    height: '300px'
                                    
                                }}
                            >
                                <CircularProgress/>
                            </Box>
                            
                        )}
                        
                    <DialogActions>
                        <Button  onClick={handleClose} sx={{backgroundColor: 'secondary.main', color:'black'}}>Cancel</Button>
                        <Button  onClick={handleSubmit} sx={{backgroundColor: 'secondary.main', color:'black'}} disabled={!imageSrc || !fishLength}>Upload</Button>
                    </DialogActions>
                </Dialog>
            
            
        </>
    );
};

export default TournamentHeader;
