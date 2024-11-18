import React, { useState, useEffect } from 'react';
import { Box, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography, Button } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../AuthContext';
import dayjs from 'dayjs';
import axios from 'axios';
import EditDialog from './EditDialog';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const UserTournaments = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [tournaments, setTournaments] = useState([]);
    const { userId } = useAuth();
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const navigate = useNavigate();
    const fetchTournaments = async () => {

        if(userId){
            try {
                const response = await axios.get(`${apiBaseUrl}/tournament/my-tournaments/${userId}`);
                const _tournaments = response.data;
                _tournaments.sort((a,b) => new Date(b.startDateTime) - new Date(a.startDateTime))
                
                console.log(_tournaments)
                setTournaments(_tournaments);
            } catch (error) {
                console.error(error, "Error retrieving tournaments");
            }
        }
        
    };

    const handleDeleteTournament = () => {
        const newTournaments = tournaments.filter(tournament => tournament.id !== selectedTournament.id);
        setTournaments(newTournaments)
    }

    useEffect(() => {
        fetchTournaments();
    }, [userId]);

    const handleOpenEdit = (tournament) => {
        setSelectedTournament(tournament);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setSelectedTournament(null);
    };

    const handleOpenDelete = (tournament) => {
        setSelectedTournament(tournament);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedTournament(null);
    };

    const handleConfirmDelete = async () => {
        try{
            const response = await axios.delete(`${apiBaseUrl}/tournament/${selectedTournament.id}`)
        } catch (error) {
            console.error(error, "Error deleting the tournament");
        }
        handleDeleteTournament();
        handleCloseDelete();
    }

    const handleNavigate = (tournamentId) => {
        navigate(`/tournament/${tournamentId}`)
    }

    return (

        <Box
            sx={{
                backgroundColor: 'primary.main'
            }}
        >
            <Container>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        pt: '20px',
                    }}
                >
                    <IconButton id="add-tournament-icon" onClick={() => {navigate('/create-tournament')}} sx={{color:"white"}}>
                        <AddIcon fontSize='large'/>
                    </IconButton>

                </Box>
                
                

                    <TableContainer component={Paper} sx={{p: 1, height: '100vh', backgroundColor: 'primary.main'}}>
                        <Table sx={{ width: '100%', backgroundColor: 'third.main'}}>
                            <TableHead>
                                <TableRow sx={{backgroundColor: 'lightgray'}}>
                                    <TableCell sx={{p: 0}}></TableCell>
                                    <TableCell align='center' sx={{p: 0}}><Typography fontWeight='bold'>Name</Typography></TableCell>
                                    <TableCell align='center' sx={{p: 0}}><Typography fontWeight='bold'>Date</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tournaments.length > 0 ? (
                                    tournaments.map((tournament, index) => (
                                        <TableRow 
                                            key={tournament.id} 
                                            sx={{background: index % 2 === 1 ? 'lightgray' : null}}
                                            onClick={(e) => {e.stopPropagation(); handleNavigate(tournament.id)}} 
                                        >
                                            <TableCell  sx={{ p: 0, maxWidth: '100px', width: '50px' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                                    <IconButton id="delete-tournament-icon" onClick={(e) => {e.stopPropagation(); handleOpenDelete(tournament)}}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton id="edit-tournament-icon" onClick={(e) => {e.stopPropagation(); handleOpenEdit(tournament)}}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                            <TableCell align='center' sx={{cursor: 'pointer'}}> 
                                                <Typography 
                                                    id="tournament-name"
                                                    sx={{width: '100%'}}
                                                >
                                                        {tournament.tournamentName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center' sx={{cursor: 'pointer'}}> 
                                                <Typography 
                                                    id="tournament-start-date"
                                                    sx={{width: '100%'}}
                                                >
                                                    {dayjs.utc(tournament.startDateTime).local().format('MM-DD-YYYY')}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell id="no-tournaments" colSpan={3} align="center">No tournaments available</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {selectedTournament && (
                            <EditDialog
                                id={"tournament-selected"}
                                tournament={selectedTournament}
                                openEdit={openEdit}
                                openDelete={openDelete}
                                handleCloseDelete={handleCloseDelete}
                                handleCloseEdit={handleCloseEdit}
                                fetchTournaments={fetchTournaments}
                            />
                        )}
                        {openDelete && (
                            <Dialog id="delete-tournament-dialog" open={openDelete} onClose={handleCloseDelete}>
                                <DialogTitle id="delete-tournament-title">
                                    Confirm Delete
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="delete-tournament-context">
                                            Are you sure you want to delete the tournament?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button id="delete-tournament-cancel" onClick={handleCloseDelete}>
                                        <Typography color="black">Cancel</Typography>
                                    </Button>
                                    <Button id="delete-tournament-confirm" onClick={handleConfirmDelete}>
                                        <Typography color="black">Confirm</Typography>
                                    </Button>
                                </DialogActions>

                            </Dialog>
                        )}
                    </TableContainer>

               
                

            </Container>

        </Box>
        
        

            
            
            
        
       
    );

   
}

export default UserTournaments