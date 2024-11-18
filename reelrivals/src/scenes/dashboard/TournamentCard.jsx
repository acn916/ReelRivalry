import React from 'react';
import { CircularProgress, Typography} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
const TournamentCard = ({tournaments, id, dashLoading}) => {

    const navigate = useNavigate();

    const handleNavigate = (tournamentId) => {
        navigate(`/tournament/${tournamentId}`)
    }
    return (
        <TableContainer>
            <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow sx={{backgroundColor: 'lightgray', width: '100%'}}>
                            <TableCell  sx={{p: 0, pl: 1}}><Typography fontWeight='bold'>Name</Typography></TableCell>
                            <TableCell  sx={{p: 0, pl: 1}}><Typography fontWeight='bold'>Date</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!dashLoading ? (
                            tournaments.length > 0 ? (
                                tournaments.map((tournament, index) => (
                                    <TableRow 
                                        key={tournament.id}
                                        sx={{backgroundColor: index % 2 === 1 ? 'lightgray' : null}}
                                    >
                                        <TableCell  sx={{cursor: 'pointer', pl: 1}}> 
                                            <Typography 
                                                id={`${id}-name`}
                                                onClick={(e) => {e.stopPropagation(); handleNavigate(tournament.id)}} 
                                                sx={{width: '100%'}}
                                            >
                                                    {tournament.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{cursor: 'pointer', pl: 1}}> 
                                            <Typography 
                                                id={`${id}-date`}
                                                onClick={(e) => {e.stopPropagation(); handleNavigate(tournament.id)}}
                                                sx={{width: '100%'}}
                                            >
                                                {dayjs.utc(tournament.startDateTime).local().format('MM-DD-YYYY')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell id={`${id}-none`} colSpan={3} align="center">No tournaments available</TableCell>
                                </TableRow>
                            )

                        ):(
                            <TableRow>
                                <TableCell colSpan={3} align='center'> <CircularProgress/></TableCell>
                            </TableRow>
                            
                        )}
                        
                    </TableBody>
                </Table>

        </TableContainer>
    )
}

export default TournamentCard