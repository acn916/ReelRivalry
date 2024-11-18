import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const TournamentContext = createContext(); 

export const TournamentProvider = ({ children }) => {
    const [tournaments, setTournaments] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    

    const value = {
        tournaments,
        isUpdated,
        setTournaments,
        setIsUpdated,

        
    };
    //console.log(isUpdated)
    return (
        <TournamentContext.Provider value={value}>
            {children}
        </TournamentContext.Provider>
    );
};

// Custom hook to use the TournamentContext
export const useTournament = () => {
    return useContext(TournamentContext);
};
