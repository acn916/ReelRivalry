import React, {useState, useEffect} from 'react'
import { Box, Container } from '@mui/material'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

import TournamentHeader from '../../components/Tournament/TournamentHeader/';
import TournamentData from '../../components/Tournament/TournamentData';
import TournamentParticipants from '../../components/Tournament/TournamentParticipants/';
import dayjs from 'dayjs';

const TournamentInfo = () => {

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const {tournamentId} = useParams();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [date, setDate] = useState();
    const [duration, setDuration] = useState()
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [status, setStatus] = useState('');
    const [participants, setParticipants] = useState([]);
    const [ownerId, setOwnerId] = useState();
    const [participantInfo, setParticipantInfo] = useState({});
    const [users, setUsers] = useState([]);
    const [openAddParticipant, setOpenAddParticipant] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [startDateTime, setStartDateTime] = useState(dayjs());
    const [endDateTime, setEndDateTime] = useState(dayjs());

    


    const handleCloseAddParticipant = () =>{
        setOpenAddParticipant(false);
    }
    const handleOpenAddParticipant = () => {
        setOpenAddParticipant(true);
    }

    const retreiveUsers = async () => {
        try{
            const response = await axios.get(`${apiBaseUrl}/user`);
            setUsers(response.data);
            //console.log(response.data);
        } catch (error) {   
            console.error(error);
        }
    }

    const retrieveTournamentInfo = async () => {

        if(tournamentId){

            try{
                const response = await axios.get(`${apiBaseUrl}/tournament/${tournamentId}`);

                const tournament = response.data;

                setName(tournament.name)
                setStartTime(tournament.startTime)
                setDate(dayjs(tournament.date).format('YYYY-MM-DD'));
                setDuration(tournament.duration);
                setEndTime(tournament.endTime);
                setSpecies(tournament.species);
                setOwnerId(tournament.userId);
                setStatus(tournament.status);
                setStartDateTime(tournament.startDateTime);
                setEndDateTime(tournament.endDateTime);

            } catch (error) {
                console.error(error);
            }
            
              
        }
        else{
            setErrorMessage('Could not retrieve tournament Information');
        }
    }

    const retrieveParticipants = async () => {

        if(tournamentId){
            try{
                const response = await axios.get(`${apiBaseUrl}/participant/participant-fish/${tournamentId}`);
                setParticipants(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        else{
            setErrorMessage("Could not retrieve participants.");
        }
    }

    const handleDeleteParticipant = async (participantId) => {

        try{
            const response = await axios.delete(`${apiBaseUrl}/participant/${participantId}`);
            //console.log(response);
            setParticipants((prev) => prev.filter((p) => p.participantId !== participantId));

        } catch (error) {   
            console.error(error);
        } 
    };

    const handleAddParticipant = async () => {

        try{
            const response = await axios.post(`${apiBaseUrl}/participant`, participantInfo);
            retrieveParticipants();
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleSendInvitation = async (invitation) => {
        try{
            const response = await axios.post(`${apiBaseUrl}/invitation`, invitation);
            //console.log(response);
        } catch (error){
            console.error(error, "Error sending invitation");
        }

    }

   

    useEffect(() => {

        setLoading(true);
        try{
            retrieveTournamentInfo();
            retrieveParticipants();
            retreiveUsers();
            
        } catch (error){
            console.error(error);
        } finally {
            setLoading(false);
        }

    }, [])
    return (
        <>
            {!loading ? (

                <Box
                    sx={{
                        display: 'flex',
                        backgroundColor: 'primary.main',
                        minHeight: '100vh'
                    }}
                >
                    <Container
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 2, // Optional: Adjust padding as needed
                            maxWidth: 'lg', // Optional: Set a max width for the container
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: 'secondary.main',
                                width: '100%',
                                marginTop: '50px',
                                borderRadius: '10px',
                                height: 'auto',
                            }}
                        >
                            <TournamentHeader 
                                name={name} 
                                status={status} 
                                tournamentId={parseInt(tournamentId)}
                                retrieveParticipants={retrieveParticipants}
                                showDetails={showDetails}
                                setShowDetails={setShowDetails}
                            />
                            {showDetails && 
                                <TournamentData
                                    date={date}
                                    species={species}
                                    startTime={startTime}
                                    endTime={endTime}     
                                    startDateTime={startDateTime}
                                    endDateTime={endDateTime}
                                />
                            }
                            <TournamentParticipants
                                participants={participants}
                                users={users}
                                tournamentId={tournamentId}
                                openAddParticipant={openAddParticipant}
                                ownerId={ownerId}
                                setParticipantInfo={setParticipantInfo}
                                handleDeleteParticipant={handleDeleteParticipant}
                                handleAddParticipant={handleAddParticipant}
                                handleCloseAddParticipant={handleCloseAddParticipant}
                                handleOpenAddParticipant={handleOpenAddParticipant}
                                status={status}
                                endDateTime={endDateTime}
                                handleSendInvitation={handleSendInvitation}
                                RetrieveParticipants={retrieveParticipants}
                                
                            />
                        </Box>
                    </Container>
                </Box>
            ): (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        </>
        
    )
}

export default TournamentInfo