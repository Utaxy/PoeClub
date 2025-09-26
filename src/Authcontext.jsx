
import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();

export const AuthProvider=({children})=>{
    const [loggedUser, setLoggedUser] = useState('');
    const [storedPicture, setStoredPicture] = useState('');


    useEffect(()=>{
        if(localStorage.getItem('alias')){
            try {
                const storedAlias = localStorage.getItem('alias');
                const storedPicture = localStorage.getItem('picture');
                setStoredPicture(storedPicture);
                setLoggedUser(storedAlias);
            } catch (error) {
                console.error(error);
            }
        }
    },[]);

    const login = (alias, picture)=>{
        localStorage.setItem('alias', alias);
        localStorage.setItem('picture',picture);
        setLoggedUser(alias);
        setStoredPicture(picture);
    }
    const logout = ()=>{
        localStorage.removeItem('alias');
        localStorage.removeItem('picture');
        setLoggedUser('');
        setStoredPicture('')
    }
    return(
        <AuthContext.Provider value={{loggedUser, login, logout, storedPicture}}>
            {children}
        </AuthContext.Provider>
    )

};

export const useAuth = ()=>{
    return useContext(AuthContext);
}
