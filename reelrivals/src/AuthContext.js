import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';


const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    
    const [currentUser, setCurrentUser] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userId, setUserId] = useState();
    const [loading, setLoading] = useState(true);

    const setUserData = async (email) =>{
        const userResponse = await axios.get(`http://localhost:5094/api/user/email/${email}`);
        const userData = userResponse.data;
        
        // set user data to context
        setUserEmail(userData.email);
        setUserFirstName(userData.first_name);
        setUserLastName(userData.last_name);
        setUserId(userData.id);

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
        setUserId,
        setUserFirstName,
        setUserLastName,
        setUserEmail,
        createUser,
        authenticate,
        logout,
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