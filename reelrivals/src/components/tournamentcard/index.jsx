import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const TournamentCard = ({ userId, name, date, duration, species }) => {
  return (
    <Link to={`/tournament/${userId}`} style={{ textDecoration: 'none', color: 'inherit'}}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // Space items across the available width
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '10px',
          backgroundColor: 'secondary.main',
          margin: '5px',
          minWidth: '300px', // Set a minimum width for the card
        }}
      >
        <Box sx={{ flexShrink: 0, padding: '0 10px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>Name:</Typography>
          <Typography>{name}</Typography>
        </Box>
        <Box sx={{ flexShrink: 0, padding: '0 10px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>Date:</Typography>
          <Typography>{new Date(date).toLocaleDateString()}</Typography>
        </Box>
        <Box sx={{ flexShrink: 0, padding: '0 10px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>Duration:</Typography>
          <Typography>{duration} hours</Typography>
        </Box>
        <Box sx={{ flexShrink: 0, padding: '0 10px', marginLeft: 'auto' }}> {/* Push this box to the right */}
          <Typography sx={{ fontWeight: 'bold' }}>Species:</Typography>
          <Typography>{species}</Typography>
        </Box>
      </Box>
    </Link>
  );
};

export default TournamentCard;
