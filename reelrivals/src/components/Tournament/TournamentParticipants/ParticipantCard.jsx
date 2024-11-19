import React, { useState } from 'react';
import {
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    useMediaQuery,
    useTheme,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Box,
    Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../../../AuthContext';
import dayjs from 'dayjs';
import axios from 'axios';

import DeleteIcon from '@mui/icons-material/Delete';

const ParticipantCard = ({ RetrieveParticipants, ownerId, participants, handleDeleteParticipant, endDateTime }) => {
    const { userId, userPicture } = useAuth();
    const [open, setOpen] = useState(false);
    const [pictureOpen, setPictureOpen] = useState(false);
    const [desktopPictureOpen, setDesktopPictureOpen] = useState(false);
    const [selectedFishIndex, setSelectedFishIndex] = useState(null);
    const [selectedParticipantIndex, setSelectedParticipantIndex] = useState(null);
    const theme = useTheme();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [openDelete, setOpenDelete] = useState(false);

    const [fishLength, setFishLength] = useState(0);
    const [fishId, setFishId] = useState(0);

    const handleOpenDelete = () =>{
        setOpenDelete(!openDelete);
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDelete = (id) => {
        handleDeleteParticipant(id);
        handleClose();
    };

   // console.log(participants)
    const handleDeleteFish = async () =>{
        try{
            const response = await axios.delete(`${apiBaseUrl}/fish/${fishId}`)
            //console.log(response)
            RetrieveParticipants();

        } catch (error) {
            console.error(error, "Error deleting fish");
        }
    }

    // Mobile dialog
    const handlePictureOpen = (index) => {
        setSelectedFishIndex(index);
        setPictureOpen(true);
    };
    const handlePictureClose = () => {
        setPictureOpen(false);
        setSelectedFishIndex(null);
    };

    const handlePatchFishLength = async () => {
        try{
            const response = await axios.patch(`${apiBaseUrl}/fish/${fishId}`,{
                "length": fishLength
            });

            RetrieveParticipants();

           // console.log(response);
        } catch (error) {
            console.error(error, "Failed updating fish length");
        }
    }

    const handleFishLengthChange = (e) => {
        const _length = e.target.value;
        setFishLength(_length);
    }

    // Desktop dialog
    const handleDesktopPictureOpen = (participantIndex, fishIndex) => {
        setSelectedParticipantIndex(participantIndex);
        setSelectedFishIndex(fishIndex);
        setDesktopPictureOpen(true);
    };
    const handleDesktopPictureClose = () => {
        setDesktopPictureOpen(false);
        setSelectedParticipantIndex(null);
        setSelectedFishIndex(null);
    };

    const handleOpenRow = (index) => {
        setOpenRowIndex(openRowIndex === index ? null : index);
    };
    const [openRowIndex, setOpenRowIndex] = useState(null);

    return (
        <TableContainer>
            <Table sx={{ width: '100%' }}>
                <TableHead>
                    <TableRow sx={{backgroundColor: 'lightgrey'}}>
                        {ownerId === userId &&
                            <TableCell></TableCell>
                        }
                        

                        <TableCell align="center">Rank</TableCell>
                        <TableCell align="center"><PersonIcon /></TableCell>
                        {[...Array(5)].map((_, fishIndex) => (
                            <TableCell key={fishIndex} align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                Fish {fishIndex + 1}
                            </TableCell>
                        ))}
                        <TableCell align="center">Total Length</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {participants.length > 0 ? (
                        participants.map((participant, participantIndex) => (
                            <React.Fragment key={participantIndex}>
                                <TableRow 
                                    sx={{ backgroundColor: participantIndex % 2 === 1 ? 'lightgray' : null }} 
                                    onClick={isMobile ? () => handleOpenRow(participantIndex) : null}
                                >
                                    {ownerId === userId && 
                                    
                                        <TableCell>
                                            <IconButton 
                                                disabled = {dayjs().isAfter(dayjs.utc(endDateTime).local())}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleOpen();
                                                }}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                            <Dialog open={open} onClose={handleClose}>
                                                <DialogTitle>Confirm Delete</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>Are you sure you want to remove the participant?</DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleClose} color="black">Cancel</Button>
                                                    <Button onClick={() => handleDelete(participant.participantId)} color="black">Confirm</Button>
                                                </DialogActions>
                                            </Dialog>
                                        </TableCell>

                                    }
                                    <TableCell align='center'>#{participantIndex + 1}</TableCell>
                                    <TableCell align='center'> 
                                        
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <Box sx={{display: 'flex', justifyContent: 'center'}}><Avatar src={participant.userPicture} alt={`${participant.userFirstName} ${participant.userLastName}`}/></Box>
                                            <Typography textAlign="center">{`${participant.userFirstName} ${participant.userLastName}`}</Typography>
                                        </Box>
                                    </TableCell>
                                    
                                    {[...Array(5)].map((_, fishIndex) => (
                                        <TableCell 
                                            key={fishIndex} 
                                            onClick={() => {!isMobile && participant.fishs[fishIndex]?.picture &&  handleDesktopPictureOpen(participantIndex, fishIndex); setFishLength(participant.fishs[fishIndex]?.length); setFishId(participant.fishs[fishIndex]?.id);}} 
                                            align="center" 
                                            sx={{ display: { xs: 'none', md: 'table-cell' } }}
                                        >
                                            {participant.fishs.length > fishIndex ? 
                                                <Typography sx={{color: 'green'}}>
                                                    {participant.fishs[fishIndex].length}
                                                </Typography>
                                                : 
                                                <Typography sx={{color: 'red'}}>X</Typography>
                                            }
                                        </TableCell>
                                    ))}
                                    <TableCell align='center'>{participant.totalLength}</TableCell>
                                </TableRow>

                                {isMobile && openRowIndex === participantIndex && (
                                    <TableRow>
                                        <TableCell colSpan={8}>
                                            <Table sx={{ backgroundColor: 'lightgray' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        {[...Array(5)].map((_, fishIndex) => (
                                                            <TableCell key={fishIndex} align="center" sx={{ padding: '5px' }}>
                                                                Fish {fishIndex + 1}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        {[...Array(5)].map((_, fishIndex) => (
                                                            <TableCell 
                                                                key={fishIndex} 
                                                                align="center" 
                                                                sx={{ padding: '5px' }}
                                                                onClick={() => {participant.fishs[fishIndex]?.picture &&  handlePictureOpen(fishIndex); setFishLength(participant.fishs[fishIndex]?.length); setFishId(participant.fishs[fishIndex]?.id); }}
                                                            >
                                                                {participant.fishs.length > fishIndex ? 
                                                                    <Typography sx={{color: 'green'}}>
                                                                        {participant.fishs[fishIndex].length}"
                                                                    </Typography> 
                                                                    : 
                                                                    <Typography sx={{color: 'red'}}>X</Typography>
                                                                }
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} align="center">No participants found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Mobile Dialog */}
            <Dialog open={pictureOpen} onClose={handlePictureClose}>
                <DialogTitle>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            
                        }}
                    >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            width: '100%'
                        }}
                    >
                        <Typography variant="h7">Fish Details</Typography>
                        </Box>
                        {ownerId === userId && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    width: '100%'
                                    
                                }}
                            >
                                <IconButton onClick={handleOpenDelete}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Box>

                        )}

                        <Dialog open={openDelete} onClose={handleOpenDelete} >
                            <DialogTitle>
                                <Typography component="span">Confirm Delete</Typography>
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    <Typography component="span">
                                        Are you sure you want to delete?
                                    </Typography>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button  onClick={handleOpenDelete}>
                                    <Typography color="black" component="span">Cancel</Typography>
                                </Button>
                                <Button  onClick={() => { handleDeleteFish(); handlePictureClose(); }}>
                                    <Typography color="black" component="span">Confirm</Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>

                    </Box>

                </DialogTitle>
                <DialogContent>
                    <img 
                        src={participants[openRowIndex]?.fishs[selectedFishIndex]?.picture} 
                        alt={`Fish ${selectedFishIndex + 1}`} 
                        style={{ width: '100%', height: 'auto' }}
                    />

                    {userId === ownerId && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                mt: 3
                            }}
                        >
                            <TextField
                                value={fishLength}
                                label="Length"
                                fullWidth
                                onChange={handleFishLengthChange}
                            />
                        </Box>


                    )}
                    
                </DialogContent>
                <DialogActions>
                    <Button  onClick={() => {handlePatchFishLength(); handlePictureClose()}}><Typography color="black">Save</Typography></Button>
                    <Button  onClick={handlePictureClose}><Typography color="black">Close</Typography></Button>
                </DialogActions>
            </Dialog>

            {/* Desktop Dialog */}
            <Dialog open={desktopPictureOpen} onClose={handleDesktopPictureClose}>
                <DialogTitle>
                <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            
                        }}
                    >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            width: '100%'
                        }}
                    >
                        <Typography variant="h7">Fish Details</Typography>
                        </Box>
                        {ownerId === userId && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    width: '100%'
                                    
                                }}
                            >
                                <IconButton onClick={handleOpenDelete}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Box>

                        )}

                        <Dialog open={openDelete} onClose={handleOpenDelete}>
                            <DialogTitle>
                                <Typography component="span">Confirm Delete</Typography>
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    <Typography component="span">
                                        Are you sure you want to delete?
                                    </Typography>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button  onClick={handleOpenDelete}>
                                    <Typography color="black" component="span">Cancel</Typography>
                                </Button>
                                <Button  onClick={() => { handleDeleteFish(); handleDesktopPictureClose(); }}>
                                    <Typography color="black" component="span">Confirm</Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>

                    </Box>
                </DialogTitle>
                <DialogContent>
                    <img 
                        src={participants[selectedParticipantIndex]?.fishs[selectedFishIndex]?.picture} 
                        alt={`Fish ${selectedFishIndex + 1}`} 
                        style={{ width: '100%', height: 'auto' }}
                    />
                    <TextField
                        value={fishLength}
                        label="Length"
                        fullWidth
                        onChange={handleFishLengthChange}
                        sx={{
                            mt: 3
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button  onClick={() => {handlePatchFishLength(); handleDesktopPictureClose()}}><Typography color="black">Save</Typography></Button>

                    <Button  onClick={handleDesktopPictureClose}><Typography color="black">Close</Typography></Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
};

export default ParticipantCard;
