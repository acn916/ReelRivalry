import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';


const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    
    const [currentUser, setCurrentUser] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userPicture, setUserPicture] = useState("");
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const setUserData = async (email) =>{
        if(!email) return;
        try{
            const userResponse = await axios.get(`${apiBaseUrl}/user/email/${email}`);
            const userData = userResponse.data;
            setUserEmail(userData.email);
            setUserFirstName(userData.first_name);
            setUserLastName(userData.last_name);
            setUserId(userData.id);
            setUserPicture(userData.picture);
        } catch (error) {
            console.error(error);
        } 
    }

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            
            if (user) {
                setCurrentUser(user);
                const email = user.email;
                setUserEmail(email);
                setUserData(email);
           
              } else {
                setCurrentUser(null);
              }
              setLoading(false);  // Firebase has finished checking the auth state
            });
        return () => unsubscribe();  // Clean up the listener on unmount
    }, [])

    const authenticate = async (email, password) => {
        const auth = getAuth();
        try{
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            setCurrentUser(userCredentials.user);
        } catch (err){
            throw err;
        }
    }

    const logout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            setCurrentUser(null);
            setUserFirstName("");
            setUserLastName("");
            setUserEmail("");
            setUserId(null);
            console.log("Successfully logged out ",userEmail );
        }).catch((error) => {
            console.error("Error during sign-out", error);
        });
    };

    const createUser = async (email, password, firstName, lastName) => {
        const auth = getAuth();
        try{
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user

            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`,
            });

            setCurrentUser(user);
            setUserEmail(user.email);
        } catch (err){
            throw err;
        }

    }

   const value = {
        currentUser,
        userEmail,
        userFirstName,
        userLastName,
        userId,
        loading,
        userPicture,
        setUserPicture,
        setUserId,
        setUserFirstName,
        setUserLastName,
        setUserEmail,
        createUser,
        authenticate,
        logout,
        setLoading,
    }

    return(

        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};