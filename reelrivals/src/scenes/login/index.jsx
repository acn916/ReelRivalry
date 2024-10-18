import React, {useState} from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const handleEmail = (e) =>{
        e.preventDefault();
        setEmail(e.target.value);
    }

    const handlePassword = (e) =>{
        e.preventDefault();
        setPassword(e.target.value);
    }

    const handleSubmit = (e) =>{
        e.preventDefault();

        setLoading(true);

        

        console.log(email);
        console.log(password);

        setTimeout(() => {
            setLoading(false); // Set loading to false after delay
        }, 2000); // 2000ms = 2 seconds
    }

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
                    <form onSubmit={handleSubmit} style={{width:'100%'}}>
                        <Stack spacing={2} sx={{ width: '100%', maxWidth: '500px' }}>
                            <Typography marginTop="5px" variant="h6" gutterBottom>
                                Login
                            </Typography>

                            <TextField  required label="email" variant="filled" value={email} autoComplete='email' onChange={handleEmail} fullWidth/>
                            <TextField 
                                required
                                label="password" 
                                variant="filled" 
                                type="password" 
                                autoComplete='password'
                                value={password} 
                                onChange={handlePassword} 
                                fullWidth
                            />
                            

                            {loading ? 
                                (
                                <LinearProgress style={{ borderRadius: '0 0 4px 4px' }} />
                                ):(
                                <Button variant="contained" type="submit">Sign in</Button>
                                )
                            }
                            


                        </Stack>
                    </form>
                    
                </Box>

            </Container>



        </Box>
    )
}

export default Login;