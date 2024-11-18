import { Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import dayjs from 'dayjs';
import axios from 'axios';
const EditDialog = ({ id, tournament, openEdit, handleCloseEdit, fetchTournaments }) => {

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const speciesList = ['Bass', 'Trout', 'Panfish', 'Crappie', 'Catfish', 'Striped Bass'];
    const [newSpecies, setNewSpecies] = useState("");
    const [newStartDate, setNewStartDate] = useState(dayjs());
    const [newStartTime, setNewStartTime] = useState(dayjs());
    const [newEndDate, setNewEndDate] = useState(dayjs());
    const [newEndTime, setNewEndTime] = useState(dayjs());
    const [lockEdit, setLockEdit] = useState(true);
    const [errorMessage, setErrorMessage] = useState("")
    const [newStartDateTime, setNewStartDateTime] = useState(dayjs())
    const [newEndDateTime, setNewEndDateTime] = useState(dayjs());

    const [errorStartDateTime, setErrorStartDateTime] = useState(false);
    const [errorEndDateTime, setErrorEndDateTime] = useState(false);
    const [status, setStatus] = useState(tournament.status);

    const [isChanged, setIsChanged] = useState(false);

    const handleLockEdit = () => {
        setLockEdit(!lockEdit);
    }
   
    const handleSpeciesChange = (e) => {
        setNewSpecies(e.target.value);
    };

    const handleStartDateChange = (newDate) => {

        if(newDate.isBefore(dayjs())){
            setErrorMessage("Error with start date and time")
            setErrorStartDateTime(true);
        }
        
        const _date = newStartDateTime
            .year(newDate.year())
            .month(newDate.month())
            .day(newDate.day());
        
        if(_date.isAfter(dayjs())){
            setStatus("Upcoming");
        }

        setNewStartDateTime(newDate)
    };

    const handleStartTimeChange = (newTime) => {
        
        const today = newStartDateTime
            .hour(newTime.hour())
            .minute(newTime.minute())
            .second(newTime.second());

        if(today.isBefore(dayjs().subtract(2, "minute"))){
            setErrorStartDateTime(true)
            setErrorMessage("Error: Start Date and Time")
            return;
        }

        if(today.isAfter(dayjs())){
            setStatus("Upcoming");
        }
        
        

        setErrorStartDateTime(false)
        setErrorMessage("");
        setNewStartDateTime(today);
    }

    const handleEndDateChange = (newDate) => {
        
        const today = newEndDateTime
            .year(newDate.year())
            .month(newDate.month())
            .day(newDate.day());
        
        if(today.isBefore(newStartDateTime)){
            setErrorMessage("Error: End date and Time");
            setErrorEndDateTime(true);
        }

        setNewEndDateTime(newDate);
    }

    const handleEndTimeChange = (newTime) => {


        const today = newEndDateTime
            .hour(newTime.hour())
            .minute(newTime.minute())
            .second(newTime.second());

        if(today.isBefore(newStartDateTime)){
            setErrorMessage("Error: Date and time must be after start");
            setErrorEndDateTime(true);
            return;
        }

        setErrorMessage("");
        setErrorEndDateTime(false);
        setNewEndDateTime(today);
    }

    const handleSpeciesReset = () => {
        if (!lockEdit) {
            setNewSpecies(tournament.species);
        }
    };
    
    const handleStartDateReset = () => {
        if (!lockEdit) {
            const startDateTime = dayjs.utc(tournament.startDateTime).local();
            setNewStartDate(startDateTime);
            setNewStartDateTime(startDateTime); // Ensures both states are reset
        }
    };
    
    const handleStartTimeReset = () => {
        if (!lockEdit) {
            const startDateTime = dayjs.utc(tournament.startDateTime).local();
            setNewStartTime(startDateTime);
            setNewStartDateTime(startDateTime); // Syncs the date and time with the primary state
        }
    };
    
    const handleEndDateReset = () => {
        if (!lockEdit) {
            const endDateTime = dayjs.utc(tournament.endDateTime).local();
            setNewEndDate(endDateTime);
            setNewEndDateTime(endDateTime); // Syncs the date and time with the primary state
        }
    };
    
    const handleEndTimeReset = () => {
        if (!lockEdit) {
            const endDateTime = dayjs.utc(tournament.endDateTime).local();
            setNewEndTime(endDateTime);
            setNewEndDateTime(endDateTime); // Syncs the date and time with the primary state
        }
    };


    const handleSave = async () => {



        const tourneyUpdate = {
            "species": newSpecies,
            "startDateTime": newStartDateTime.utc().format('YYYY-MM-DDTHH:mm:ss'),
            "endDateTime": newEndDateTime.utc().format('YYYY-MM-DDTHH:mm:ss'),
            "status": status,
        }
        
        await axios.patch(`${apiBaseUrl}/tournament/${tournament.id}`, tourneyUpdate)
        fetchTournaments();
        handleCloseEdit();
    };

     // Set the initial species when the dialog opens
     useEffect(() => {
        if (tournament) {
            if(tournament.species) {
                setNewSpecies(tournament.species);
            }
            if(tournament.startDateTime){
                
                setNewStartDateTime(dayjs.utc(tournament.startDateTime).local());
                

            }
            if(tournament.endDateTime){
                
                setNewEndDateTime(dayjs.utc(tournament.endDateTime).local());
            }

            

        }
    }, [tournament]);

    return (
        <Dialog
            id="Test-Dialog"
            open={openEdit}
            onClose={handleCloseEdit}
        >
            <DialogTitle id={`${id}-title`} align="center">
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center'

                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography id={`${id}-name`} fontWeight="bold" variant="h5">{tournament.tournamentName}</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            
                        }}
                    >
                        {tournament.status != "Previous" && (
                            <IconButton id={`${id}-lock`} onClick={handleLockEdit}>
                                {lockEdit ? <LockIcon/> : <LockOpenIcon/>}
                            </IconButton>

                        )}
                        
                        
                    </Box>

                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%'
                    }}  
                >
                    <Typography color='red'>{errorMessage}</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        width: '300px'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%'
                            }}
                        >
                            <FormControl fullWidth variant="filled" >
                                <InputLabel id="species-select-label">Species</InputLabel>
                                <Select
                                    labelId="species-select-label"
                                    id="species-select"
                                    value={newSpecies}
                                    onChange={handleSpeciesChange}
                                    disabled={lockEdit}
                                >
                                    {speciesList.map((species) => (
                                        <MenuItem key={species} value={species}>
                                            {species}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Box>
                        <Box
                           sx={{
                                display: 'flex',
                                mt: 1,
                                
                           }}
                        >
                            
                            <IconButton id={`${id}-redo`} onClick={handleSpeciesReset}>
                                <SettingsBackupRestoreIcon/>
                            </IconButton>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            pt: 2,
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%'
                            }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker 
                                    id={`${id}-start-date`}
                                    label="Start Date" 
                                    value={newStartDateTime} 
                                    variant="filled"
                                    onChange={handleStartDateChange}
                                    disablePast
                                    
                                    slotProps={{
                                        textField:{
                                            variant: "filled",
                                            fullWidth: true,
                                            error: !!errorStartDateTime
                                            
                                        }
                                    }}                                   
                                    disabled={lockEdit}
                                    sx={{
                                        width: '100%'
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box
                           sx={{
                                display: 'flex',
                                mt: 1,
                                
                           }}
                        >
                            
                            <IconButton onClick={handleStartDateReset}>
                                <SettingsBackupRestoreIcon/>
                            </IconButton>
                        </Box>
                        
                        
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            pt: 2,
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%'
                            }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopTimePicker 
                                    label="Start time"
                                    value={newStartDateTime}
                                    onChange={handleStartTimeChange}
                                    timeSteps={{hours: 1, minutes: 1}}
                                    slotProps={{
                                        textField:{
                                            variant: "filled",
                                            fullWidth: true,
                                            error: !!errorStartDateTime
                                        }
                                    }}
                                    sx={{
                                        width: '100%'
                                    }}
                                    disabled={lockEdit}
                                />
                            </LocalizationProvider>
                            
                        </Box>
                        <Box
                           sx={{
                                display: 'flex',
                                mt: 1,
                                
                           }}
                        >
                            
                            <IconButton onClick={handleStartTimeReset}>
                                <SettingsBackupRestoreIcon/>
                            </IconButton>
                        </Box>
                        
                        
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            pt: 2,
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%'
                            }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker 
                                    label="End Date" 
                                    value={newEndDateTime} 
                                    variant="filled"
                                    onChange={handleEndDateChange}
                                    disablePast
                                    slotProps={{
                                        textField:{
                                            variant: "filled",
                                            fullWidth: true,
                                            error: errorEndDateTime

                                            
                                        }
                                    }}                                    
                                    disabled={lockEdit}
                                    sx={{
                                        width: '100%'
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box
                           sx={{
                                display: 'flex',
                                mt: 1,
                                
                           }}
                        >
                            
                            <IconButton onClick={handleEndDateReset}>
                                <SettingsBackupRestoreIcon/>
                            </IconButton>
                        </Box>
                        
                        
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            pt: 2,
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%'
                            }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopTimePicker 
                                    label="End time"
                                    value={newEndDateTime}
                                    onChange={handleEndTimeChange}
                                    timeSteps={{hours: 1, minutes: 1}}
                                    slotProps={{
                                        textField:{
                                            variant: "filled",
                                            fullWidth: true,
                                            error: errorEndDateTime
                                        }
                                    }}                                    
                                    sx={{
                                        width: '100%'
                                    }}
                                    disabled={lockEdit}
                                />
                            </LocalizationProvider>
                            
                        </Box>
                        <Box
                           sx={{
                                display: 'flex',
                                mt: 1,
                                
                           }}
                        >
                            
                            <IconButton onClick={handleEndTimeReset}>
                                <SettingsBackupRestoreIcon/>
                            </IconButton>
                        </Box>
                        
                        
                    </Box>
                    
                </Box>
            </DialogContent>
            <DialogActions>
                <Button 
                    disabled={errorEndDateTime || errorStartDateTime || tournament.status === 'Previous'}
                    onClick={handleSave} sx={{color: 'black'}}>Save</Button>
                <Button onClick={handleCloseEdit} sx={{color:'black'}}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditDialog