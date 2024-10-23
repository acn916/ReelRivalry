import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Box, Container, Stack, Typography, Paper } from '@mui/material';
import axios from 'axios';
import TournamentCard from '../../components/tournamentcard';

const Dashboard = () => {
  const { userId } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [ongoingTournaments, setOngoingTournaments] = useState([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState([]);
  const [previousTournaments, setPreviousTournaments] = useState([]);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5094/api/tournament/user/${userId}`)
        .then(response => {
          setTournaments(response.data);
          setOngoingTournaments(response.data.filter(tournament => tournament.status === "Ongoing"));
          setUpcomingTournaments(response.data.filter(t => t.status === "Upcoming"));
          setPreviousTournaments(response.data.filter(prevTournament => prevTournament.status === "Previous"));
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [userId]);

  
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Stack
          spacing={2}
          sx={{
            marginTop: '40px',
            width: '100%',
            backgroundColor: 'secondary.main'
          }}
        >
          {['Ongoing Tournaments', 'Upcoming Tournaments', 'Previous Tournaments'].map((section, index) => (
            <Paper key={index} elevation={3} sx={{ padding: '16px', backgroundColor: 'third.main'}}>
              <Typography variant="h8">{section}</Typography>
              <Box
                sx={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  margin: '20px',
                  
                }}
              >
                {section === "Ongoing Tournaments" && (
                  ongoingTournaments.length > 0 ? (
                    ongoingTournaments.map(t => (
                      <TournamentCard
                        id="onoing-tournament"
                        key={t.id}
                        userId={t.id}
                        name={t.name}
                        date={t.date}
                        duration={t.duration}
                        species={t.species}
                      />
                    ))
                  ): 
                  (
                    <Typography variant="h8">No tournaments found</Typography>
                  ))}

                {section === "Upcoming Tournaments" && (
                  upcomingTournaments.length > 0 ? (
                    upcomingTournaments.map(t => (
                      <TournamentCard
                        id="upcoming-tournament"
                        key={t.id}
                        userId={t.id}
                        name={t.name}
                        date={t.date}
                        duration={t.duration}
                        species={t.species}
                      />
                    ))
                  ): 
                  (
                    <Typography variant="h8">No tournaments found</Typography>
                  ))}
                {section === 'Previous Tournaments' && (
                  previousTournaments.length > 0 ? (
                    previousTournaments.map(t => (
                      <TournamentCard
                        id="previous-tournament"
                        key={t.id}
                        userId={t.id}
                        name={t.name}
                        date={t.date}
                        duration={t.duration}
                        species={t.species}
                      />
                    ))
                  ):
                  (
                    <Typography variant="h8">No tournaments found</Typography>
                  )
                )}


              </Box>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Dashboard;
