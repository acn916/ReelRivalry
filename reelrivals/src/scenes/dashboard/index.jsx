import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Box, Container, Stack, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useTournament } from '../../TournamentContext';
import TournamentCard from './TournamentCard';

const Dashboard = () => {
  const { userId, loading } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [ongoingTournaments, setOngoingTournaments] = useState([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState([]);
  const [previousTournaments, setPreviousTournaments] = useState([]);
  const { isUpdated, setIsUpdated } = useTournament();
  const [dashLoading, setDashLoading] = useState(false);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  

  const fetchTournaments = async () => {
    if (userId) {
      setDashLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/tournament/all-tournaments/${userId}`);

        const _tournaments = response.data;
        _tournaments.sort((a,b) => b.startDateTime - a.startDateTime);
        setTournaments(_tournaments);

        setOngoingTournaments(_tournaments.filter(tournament => tournament.status === "Ongoing").sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime)));
        setUpcomingTournaments(_tournaments.filter(t => t.status === "Upcoming").sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime)));
        setPreviousTournaments(_tournaments.filter(prevTournament => prevTournament.status === "Previous").sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime)));
      } catch (error) {
        console.error(error);
      } finally {
        setDashLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!loading && userId) {
      fetchTournaments();
      if (isUpdated) {
        setIsUpdated(false);
      }
    }
    const interval = setInterval(() => {
      if (userId) fetchTournaments();
    }, 1 * 60 * 1000); // 1-minute interval

    return () => clearInterval(interval);
  }, [loading, userId, isUpdated]);

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
              backgroundColor: 'primary.main'
            }}
          >
            {['Ongoing Tournaments', 'Upcoming Tournaments', 'Previous Tournaments'].map((section, index) => (
              <Paper id={`section-${section.replace(" ", "-").toLowerCase()}`} key={index} elevation={3} sx={{ padding: '16px', backgroundColor: 'third.main'}}>
                <Typography variant="h8" fontWeight='bold'>{section}</Typography>
                <Box sx={{ justifyContent: 'center', alignContent: 'center', margin: '20px' }}>
                  {section === "Ongoing Tournaments" && (


                   
                      <TournamentCard
                        id={"ongoing-tournaments"}
                        tournaments={ongoingTournaments}
                        setTournaments={setOngoingTournaments}
                        loading={loading}
                        dashLoading={dashLoading}
                      />
                    
                    
                  )}
                  {section === "Upcoming Tournaments" && (
                    <TournamentCard
                      id={"upcoming-tournaments"}
                      tournaments={upcomingTournaments}
                      setTournaments={setUpcomingTournaments}
                      loading={loading}
                      dashLoading={dashLoading}
                    />
                  )}
                  {section === 'Previous Tournaments' && (
                    <TournamentCard
                      id={"previous-tournaments"}
                      tournaments={previousTournaments}
                      setTournaments={setPreviousTournaments}
                      loading={loading}
                      dashLoading={dashLoading}
                    />
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
