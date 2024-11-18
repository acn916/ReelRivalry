import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Typography } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { app } from './firebaseConfig'; // Adjust the path as necessary

const ImageUploadDialog = ({ open, onClose }) => {
    const [image, setImage] = useState('');
    const [length, setLength] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${Date.now()}`); // Unique path for each image

        try {
            // Upload the image
            await uploadString(storageRef, image, 'data_url');
            // Get the image URL
            const url = await getDownloadURL(storageRef);
            setImageUrl(url);
            // Send this URL to your database as needed
            //console.log('Uploaded Image URL:', url);
            // Optionally clear the dialog
            onClose();
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const handleLengthInput = (e) =>{
        const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters

        if (input) {
            setRawLength(input); // Store raw numeric input
            // Divide by 100 and format to 2 decimal places
            const formattedLength = (parseFloat(input) / 100).toFixed(2);
            setLength(formattedLength); // Set display length with decimal
        } else {
            setRawLength('');
            setLength('0.00'); // Reset to 0.00 if input is empty
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogContent>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-button-file"
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="upload-button-file">
                    <IconButton component="span">
                        <UploadIcon />
                    </IconButton>
                    <Typography variant="body2">Upload Image</Typography>
                </label>
                {image && (
                    <div>
                        <img src={image} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />
                        <TextField
                            label="Fish Length"
                            variant="outlined"
                            fullWidth
                            value={length}
                            onChange={handleLengthInput}
                            style={{ marginTop: '10px' }}
                        />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpload} color="primary" disabled={!image}>
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImageUploadDialog;
