import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AddParticipant from './AddParticipant';
import ParticipantCard from './ParticipantCard';
import { useAuth } from '../../../AuthContext';
import PersonIcon from '@mui/icons-material/Person';

const TournamentParticipants = ({ RetrieveParticipants, handleSendInvitation, endDateTime,status, participants, users, tournamentId, setParticipantInfo, handleDeleteParticipant, handleAddParticipant, handleCloseAddParticipant, handleOpenAddParticipant, openAddParticipant, ownerId }) => {
    const {userId} = useAuth();

    const getTotalFishLength = (userId) => {

      let participantFish = {};
      for(let i = 0; i < participants.length; ++i){
        if(participants[i].userId == userId){
          participantFish = participants[i].fishs;
          break;
        }
      }

      participantFish.sort((a,b) => b.length - a.length);
      let total = 0;
      let size = participantFish.length > 5 ? 5 : participantFish.length;

      for(let i = 0 ; i < size; ++i){
        total += participantFish[i].length;
      }

      return total;
     
    }

    participants.sort((a,b) => b.totalLength - a.totalLength);

    const insertTotalLength = () =>{
      for(let i = 0; i < participants.length; ++i){
        const userId = participants[i].userId;
        participants[i].totalLength = getTotalFishLength(userId);
      }
    }

    insertTotalLength();
    

    return (
    <>
      {/* Participants Box */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: "10px 0",
          justifyContent: 'center',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Box
            sx={{
              
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {ownerId === userId &&
                <IconButton onClick={handleOpenAddParticipant} disabled={status === 'Previous'}>
                    <PersonAddAltIcon />
                </IconButton>
            }
            

            <AddParticipant
              open={openAddParticipant}
              handleClose={handleCloseAddParticipant}
              users={users}
              tournamentId={tournamentId}
              handleAddParticipant={handleAddParticipant}
              setParticipantInfo={setParticipantInfo}
              handleSendInvitation={handleSendInvitation}
            />
          </Box>
          <Box
            sx={{
              
              justifyContent: 'center',
              margin: 'auto',
              width: '100%'
            }}
          >
            <Typography fontWeight= 'bold' variant='h5'>Anglers</Typography>
          </Box>
          <Box
            sx={{
              
              display:'flex',
              justifyContent: 'center',
              paddingRight: '30px',
              width: '100%',
              mt:'10px'
              
              
            }}
          >
           <Box>
            <PersonIcon/>
           </Box>
            {participants.length}
           <Box>

           </Box>
          </Box>
        </Box>

        {/* Participants Cards */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '10px',
            overflowX: 'auto',
          }}
        >
          <ParticipantCard 
            RetrieveParticipants={RetrieveParticipants} 
            ownerId={ownerId} participants={participants} 
            handleDeleteParticipant={handleDeleteParticipant} 
            endDateTime={endDateTime}/>
        </Box>
      </Box>
    </>
  );
}

export default TournamentParticipants;
