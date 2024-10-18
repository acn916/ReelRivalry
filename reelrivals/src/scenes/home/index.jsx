import { Button, Box, Container, Typography } from '@mui/material';
import Signup from '../signup';
import React from 'react';

function Home() {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        display: 'flex',
        flexDirection: 'column',    // Arrange items vertically
        minHeight: '100vh',
        justifyContent: 'top',   // Center items vertically
        alignItems: 'center',       // Center items horizontally
        textAlign: 'center',        // Center the text itself
      }}
    >
        <Typography 
            color="secondary.main" 
            variant="h6" 
            gutterBottom
            marginTop="20px"
        >
            Friendly fishing tournament app used for friends and family.
        </Typography>
      
      <Signup />
    </Box>
  );
}

export default Home;
