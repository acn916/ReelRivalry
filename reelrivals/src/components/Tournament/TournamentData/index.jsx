import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Use the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const TournamentData = ({date, species, startTime, endTime, startDateTime, endDateTime}) => {
  return (
        <Box 
            sx={{
                flexGrow: 1, 
                justifyContent: 'center',
                alignItems: 'center',
                padding: 3
            }}
        >
            <Grid 
                container 
                spacing={2}
            >
                
                <Grid size={{xs: 6, md: 6}} sx={{display: 'flex', justifyContent: {xs: 'center'}}}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column', 
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{}}>
                            <Typography>Date</Typography>
                            <Box 
                                sx={{
                                    border: '0px',
                                    height: '2px',
                                    backgroundColor: 'grey',
                                    width: '100%',
                                    margin: '-5px 0',
                                    marginBottom: '3px'
                                }}
                            />
                        </Box>
                        <Box>{dayjs.utc(startDateTime).local().format('MM-DD-YYYY')}</Box>


                    </Box>
                </Grid>

                <Grid size={{xs: 6, md: 6}} sx={{display: 'flex', justifyContent: {xs: 'center'}}}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column', 
                            justifyContent: 'center',
                            alignItems: 'center',
                            
                        }}
                    >
                        <Box sx={{}}>
                            <Typography>Species</Typography>
                            <Box 
                                sx={{
                                    border: '0px',
                                    height: '2px',
                                    backgroundColor: 'grey',
                                    width: '100%',
                                    margin: '-5px 0',
                                    marginBottom: '3px',
                                }}
                            />
                        </Box>
                        <Box>{species}</Box>


                    </Box>
                </Grid>
                <Grid size={{xs: 6, md: 6}} sx={{display: 'flex', justifyContent: {xs: 'center'}}}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column', 
                            justifyContent: 'center',
                            alignItems: 'center',  
                        }}
                    >
                        <Box sx={{}}>
                            <Typography>Start Time</Typography>
                            <Box 
                                sx={{
                                    border: '0px',
                                    height: '2px',
                                    backgroundColor: 'grey',
                                    width: '100%',
                                    margin: '-5px 0',
                                    marginBottom: '3px',
                                }}
                            />
                        </Box>
                        <Box>{dayjs.utc(startDateTime).local().format('MM/DD/YYYY - h:mm A')}</Box>


                    </Box>
                </Grid>
                <Grid size={{xs: 6, md: 6}} sx={{display: 'flex', justifyContent: {xs: 'center'}}}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column', 
                            justifyContent: 'center',
                            alignItems: 'center',
                            
                        }}
                    >
                        <Box sx={{}}>
                            <Typography>End Time</Typography>
                            <Box 
                                sx={{
                                    border: '0px',
                                    height: '2px',
                                    backgroundColor: 'grey',
                                    width: '100%',
                                    margin: '-5px 0',
                                    marginBottom: '3px',
                                }}
                            />
                        </Box>
                        <Box>{dayjs.utc(endDateTime).local().format('MM/DD/YYYY - h:mm A')}</Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>

  )
}

export default TournamentData;