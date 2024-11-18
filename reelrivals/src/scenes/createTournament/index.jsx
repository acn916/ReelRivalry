import React, { useState } from 'react'
import { Box, Container, TextField, Typography, FormControl, Select, MenuItem, InputLabel, Button } from '@mui/material'
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { useAuth } from '../../AuthContext';
import utc from 'dayjs/plugin/utc';
import local from 'dayjs/plugin/localizedFormat';
import axios from 'axios';

dayjs.extend(utc);
dayjs.extend(local);

const CreateTournament = () => {
    const [tournamentName, setTournamentName] = useState("");
    const [date, setDate] = useState(dayjs()); // Default date set to current date
    const [time, setTime] = useState(dayjs().set('hour', 8).set('minute', 0).set('second', 0)); // Default time set to 8 AM local time


    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());

    const [startTime, setStartTime] = useState(dayjs());
    const [endTime, setEndTime] = useState(dayjs());


    const [durationTime, setDurationTime] = useState({ hours: 0, minutes: 0 });
    const [species, setSpecies] = useState('Bass');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { userId } = useAuth();

    const handleNameChange = (e) => {
      const name = e.target.value;
      setTournamentName(name);
    }

    const handleDateChange = (newDate) => {
      setDate(newDate);
    }

    const handleTimeChange = (newTime) => {
      setTime(newTime);
    }

    const handleEndDateChange = (newDate) => {
      setEndDate(newDate);
    }

    const handleEndTimeChange = (newTime) => {
      setEndTime(newTime);
    }

    const handleDurationChange = (newDuration) => {
      setDurationTime({
        hours: newDuration.hour(),
        minutes: newDuration.minute(),
      });
    };

    const handleSpeciesChange = (e) => {
      setSpecies(e.target.value);
    };

    const convertTimeDate = () => {
      // Merge the date and time objects using the hour and minute from the time state
      const mergedDateTime = dayjs(date).set('hour', time.hour()).set('minute', time.minute()).set('second', 0);

      // Convert the merged date and time to local time before converting to UTC
      const localDateTime = mergedDateTime.local();

      // Convert the local date and time to UTC
      const formattedDateTime = localDateTime.utc().format("YYYY-MM-DDTHH:mm:ss");

      return formattedDateTime;
    }

    const configureStartEndTime = () => {

      const startDateTime = dayjs(date).set('hour', time.hour()).set('minute', time.minute()).set('second', 0);

      const endDateTime = dayjs(endDate).set('hour', endTime.hour()).set('minute', endTime.minute()).set('second', 0);

      // Convert both start and end dateTimes to UTC
      const utcStartDateTime = startDateTime.utc().format('YYYY-MM-DDTHH:mm:ss');
      const utcEndDateTime = endDateTime.utc().format('YYYY-MM-DDTHH:mm:ss');

      return [utcStartDateTime, utcEndDateTime];
    }

    const handleSubmit = async () => {
        if (!tournamentName || !time || !species || !endTime) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        const formattedDateTime = convertTimeDate();
        const currentTime = dayjs().subtract(2, "minute").utc().format("YYYY-MM-DDTHH:mm:ss");
        const [start, end] = configureStartEndTime();

        if(dayjs(start).isBefore(currentTime)){
          setErrorMessage(`Cannot create a tournament before the current time: ${dayjs().format('h:mm A')}`);
          return;
        }
        
        setLoading(true);
        setErrorMessage('');

        const duration = `${durationTime.hours.toString().padStart(2, '0')}:${durationTime.minutes.toString().padStart(2, '0')}:00`;
        const utcTime = dayjs().utc().format('YYYY-MM-DDTHH:mm:ss');
        const status = dayjs(formattedDateTime).isAfter(dayjs(utcTime)) ? "Upcoming" : "Ongoing";



        console.log(status);

        const startAndEnd = configureStartEndTime();
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;


        const tournamentData = {
          "name": tournamentName,
          "date": formattedDateTime,
          "duration": duration,
          "species": species,
          "startTime": startAndEnd[0].substring(11), // Extracting just the time part
          "endTime": startAndEnd[1].substring(11), // Extracting just the time part
          "startDateTime": startAndEnd[0],
          "endDateTime": startAndEnd[1],
          "status": status,
          "userId": userId
        }

      

        try {
          
          const response = await axios.post(`${apiBaseUrl}/tournament`, tournamentData);
          const tournamentId = response.data.id

          await axios.post(`${apiBaseUrl}/participant`, {
            "userId": userId,
            "tournamentId": tournamentId,
          })
          
          setTournamentName("");
          setDate(dayjs());
          setTime(dayjs());
          setDurationTime({ hours: 0, minutes: 0 });
          setSpecies("Bass");
          navigate('/dashboard');
          
        } catch (error) {
          console.error(error);
          setErrorMessage("Failed to create tournament. Please try again.");
        } finally {
          setLoading(false);
        }
        
    };

    const speciesSlots = ['Bass', 'Trout', 'Panfish', 'Striped Bass'];

    return (

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'primary.main',
          minHeight: '100vh'

        }}   
      >
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',  // Center horizontally
            justifyContent: 'flex-start', // Start near the top
            width: '100%',
            marginTop: '50px' 
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
            <Box>
              <Typography id="tournament-title"variant={'h6'}>
                Tournament
              </Typography>
              {errorMessage && <Typography id="tournament-error" color="error">{errorMessage}</Typography>}
            </Box>
            <Grid 
              container 
              spacing={2}                         
            >
              <Grid size={12}>
                <TextField 
                  id='tournament-name'
                  label='Tournament Name'
                  variant='filled' 
                  onChange={handleNameChange}
                  value={tournamentName}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <FormControl fullWidth variant="filled">
                  <InputLabel id="species-select-label">Species</InputLabel>
                  <Select
                    id="tournament-species"
                    labelId="species-select-label"
                    value={species}
                    onChange={handleSpeciesChange}
                  >
                    {speciesSlots.map((specie) => (
                      <MenuItem key={specie} value={specie}>
                        {specie}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <Box sx={{display:'flex', justifyContent: 'center', width: '100%'}}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={date}
                      variant="filled"
                      onChange={handleDateChange}
                      disablePast
                      sx={{
                        width:'100%',
                      }}
                      slotProps={{
                        textField: {
                          id: 'tournament-date',  // Ensure ID is passed here
                          width: '100%'
                        },
                      }}
                    />
                  </LocalizationProvider>

                </Box>
               
              </Grid>

              <Grid size={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopTimePicker
                    id="tournament-start-time" 
                    label="Start time"
                    value={time}
                    onChange={handleTimeChange}
                    timeSteps={{hours: 1, minutes: 1}}
                    
                    renderInput={(params) => <TextField {...params} variant="filled" fullWidth />}
                    
                  />
                </LocalizationProvider>
              </Grid>
              <Grid size={6}>
                <Box sx={{display:'flex', justifyContent: 'center', width: '100%'}}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      variant="filled"
                      onChange={handleEndDateChange}
                      disablePast
                      sx={{
                        width:'100%',
                      }}
                      slotProps={{
                        textField: {
                          id: 'tournament-end-date',  // Ensure ID is passed here
                          width: '100%'
                        },
                      }}
                    />
                  </LocalizationProvider>

                </Box>
               
              </Grid>
              <Grid size={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopTimePicker
                      id="tournament-start-time" 
                      label="End time"
                      value={endTime}
                      onChange={handleEndTimeChange}
                      timeSteps={{hours: 1, minutes: 1}}
                      
                      renderInput={(params) => <TextField {...params} variant="filled" fullWidth />}
                      
                    />
                  </LocalizationProvider>
              </Grid>
              
            </Grid>
            <Button
              id="tournament-submit-button" 
              variant='filled' 
              sx={{
                backgroundColor: 'primary.main', 
                margin: '20px', 
                width: '100%'
              }}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Submitting...' : "Submit"}  
            </Button>
          </Box>
        </Container>    
      </Box>
      
    )
}

export default CreateTournament