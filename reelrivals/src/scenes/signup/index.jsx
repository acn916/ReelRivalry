import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../../firebaseConfig'; // Ensure you are importing 'app' correctly
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const auth = getAuth(app);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordReentry, setPasswordReentry] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // State to hold error messages
    const [inputRequired, setInputRequired] = useState("");
    const navigate = useNavigate()


    const handleFirstName = (e) => {
        setFirstName(e.target.value);
        setInputRequired("");
    }

    const handleLastName = (e) => {
        setLastName(e.target.value);
        setInputRequired("");
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
        setInputRequired("");
    }

    const handlePassword = (e) => {
       
        setPassword(e.target.value);

        const p = e.target.value;
        setPassword(p);

        if (p.length < 6) {
            setInputRequired("Password must be at least 6 characters");
        } else {
            setInputRequired("");  // Clear the error message if valid
        }
    }

    const handlePasswordReentry = (e) =>{
        
        const p = e.target.value;
        setPasswordReentry(p);

        if(password != p){
            setInputRequired("Password does not match");
        }
        else{
            setInputRequired("");
        }
    }
    // Prevent the form from refreshing the page
    const handleSignUp = async (e) => {

        e.preventDefault();  // Prevents page reload

        if(!firstName){
            setInputRequired("Please enter a first name");
            return;
        }
        else if(!lastName){
            setInputRequired("Please enter a last name");
            return;
        }
        else if(!email){
            setInputRequired("Please enter a email");
            return;
        }
        else if(!password){
            setInputRequired("Please enter a password");
            return;
        }
        else if(!passwordReentry){
            setInputRequired("Please re-enter password");
            return;
        }
        else if(password.length < 6){
            setInputRequired("Password should be at least 6 characters");
            return;
        }
        else if(password != passwordReentry){
            setInputRequired("Password does not match");
            return;
        }

        setLoading(true);
        

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created successfully:', email);
            navigate('/dashboard');
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
                            id="firstname-input"
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            autoComplete="given-name"
                            value={firstName}  // Controlled input
                            onChange={handleFirstName}
                        />
                        <TextField
                            id="lastname-input"
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            autoComplete="family-name"
                            value={lastName}  // Controlled input
                            onChange={handleLastName}
                        />
                        <TextField
                            id="email-input"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            autoComplete="email"
                            value={email}  // Controlled input
                            onChange={handleEmail}
                        />
                        <TextField
                            id="password-input"
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            autoComplete="new-password"
                            value={password}  // Controlled input
                            onChange={handlePassword}
                        />
                        <TextField
                            id="password-reentry-input"
                            label="Re-enter Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            autoComplete="new-password"
                            onChange={handlePasswordReentry}
                        />
                        {inputRequired && <Typography id="input-required" color="red">{inputRequired}</Typography>}
                        {error && <Typography id="error-output" color="error">{error}</Typography>} {/* Display error message */}

                        {loading ? 
                            (
                                <LinearProgress style={{ borderRadius: '0 0 4px 4px' }} />
                            ):(
                                <Button id="signup-button" variant="contained" type="submit">Sign Up</Button>
                            )
                        }
                    </Stack>
                </form>
            </Box>
        </Container>
    );
}

export default Signup;
