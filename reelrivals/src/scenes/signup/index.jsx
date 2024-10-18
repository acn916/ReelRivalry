import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../../firebaseConfig'; // Ensure you are importing 'app' correctly

const Signup = () => {

    const auth = getAuth(app);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // State to hold error messages


    const handleFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastName = (e) => {
        setLastName(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    // Prevent the form from refreshing the page
    const handleSignUp = async (e) => {

        e.preventDefault();  // Prevents page reload
        setLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created successfully:', email);
        } catch (err) {
            setError(err.message);
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'auto',
                    backgroundColor: 'secondary.main',
                    margin: '20px',
                    paddingBottom: '20px',
                    paddingX: '16px',
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '10px'
                }}
            >
                <Typography marginTop="5px" variant="h6" gutterBottom>
                    Signup
                </Typography>

                {/* Form Submission Handler */}
                <form onSubmit={handleSignUp} style={{ width: '100%' }}>
                <Stack spacing={2} sx={{ width: '100%', maxWidth: '500px' }}>
                    <TextField
                        required
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        autoComplete="given-name"
                        value={firstName}  // Controlled input
                        onChange={handleFirstName}
                    />
                    <TextField
                        required
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        autoComplete="family-name"
                        value={lastName}  // Controlled input
                        onChange={handleLastName}
                    />
                    <TextField
                        required
                        label="Email"
                        variant="outlined"
                        fullWidth
                        autoComplete="email"
                        value={email}  // Controlled input
                        onChange={handleEmail}
                    />
                    <TextField
                        required
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        autoComplete="new-password"
                        value={password}  // Controlled input
                        onChange={handlePassword}
                    />
                    <TextField
                        required
                        label="Re-enter Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        autoComplete="new-password"
                    />

                    {error && <Typography color="error">{error}</Typography>} {/* Display error message */}

                    {loading ? 
                        (
                        <LinearProgress style={{ borderRadius: '0 0 4px 4px' }} />
                        ):(
                        <Button variant="contained" type="submit">Sign Up</Button>
                        )
                    }
                </Stack>
                </form>
            </Box>
        </Container>
    );
}

export default Signup;
