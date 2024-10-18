import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../../firebaseConfig'; // Ensure you are importing 'app' correctly

const Login = () => {
    const auth = getAuth(app);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // State to hold error messages

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error state

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in:', email);
            // You can redirect or perform further actions after login
        } catch (err) {
            setError(err.message); // Set error message to state
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                justifyContent: 'top',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
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
                        boxShadow: 24,
                        borderRadius: '10px'
                    }}
                >
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Stack spacing={2} sx={{ width: '100%', maxWidth: '500px' }}>
                            <Typography marginTop="5px" variant="h6" gutterBottom>
                                Login
                            </Typography>

                            <TextField
                                required
                                label="Email"
                                variant="filled"
                                value={email}
                                autoComplete='email'
                                onChange={handleEmail}
                                fullWidth
                            />
                            <TextField
                                required
                                label="Password"
                                variant="filled"
                                type="password"
                                autoComplete='current-password'
                                value={password}
                                onChange={handlePassword}
                                fullWidth
                            />
                            {error && <Typography color="error">Invalid user name or password</Typography>} {/* Display error message */}

                            {loading ? (
                                <LinearProgress style={{ borderRadius: '0 0 4px 4px' }} />
                            ) : (
                                <Button variant="contained" type="submit">
                                    Sign in
                                </Button>
                            )}
                        </Stack>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
