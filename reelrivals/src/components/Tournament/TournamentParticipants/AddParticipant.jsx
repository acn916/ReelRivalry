import React, { useState } from 'react';
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Button, 
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

const AddParticipant = ({handleSendInvitation, open, handleClose, tournamentId, users, setParticipantInfo}) => {

    //console.log(users);
    
    const [userId, setUserId] = useState('');
    

    const handleSelectChange = (e) =>{
        const selectedUserId = e.target.value;
        setUserId(selectedUserId);
        setParticipantInfo({
            "userId": selectedUserId,
            "tournamentId": tournamentId
        })
    }

    const onConfirm = () =>{
        handleSendInvitation({
            "userId": userId,
            "tournamentId": tournamentId,
        });
        handleClose();
    }    

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            
        >
            <DialogTitle>Add Participant</DialogTitle>
            <DialogContent
                sx={{
                    width: '300px',
                    height: '200px'
                }}
            >
                <FormControl sx={{pt:3}}fullWidth>
                    <InputLabel id="user-select-label" sx={{pt: 3}}>Users</InputLabel>
                    <Select
                        labelId='select-user'
                        id='select-user'
                        value={userId}
                        label="User"
                        onChange={handleSelectChange}
                    >
                        {users.length > 0 && 
                        
                            users.map(user => (
                                <MenuItem key={user.id} value={user.id}>{`${user.first_name} ${user.last_name}` }</MenuItem>
                            ))
                        }
                        
                    </Select>
                </FormControl>

            </DialogContent>
            <DialogActions>
                <Button  onClick={handleClose} color={'secondary.main'}>
                    Cancel
                </Button>
                <Button  onClick={onConfirm} color={'secondary.main'}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddParticipant;