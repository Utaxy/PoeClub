
import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();

export const AuthProvider=({children})=>{
    const [loggedUser, setLoggedUser] = useState('');


    useEffect(()=>{
        if(localStorage.getItem('Alias')){
            try {
                const storedAlias = JSON.parse(localStorage.getItem('Alias'));
                setLoggedUser(storedAlias)
            } catch (error) {
                console.error(error);
            }
        }
    },[]);

    const login = (alias)=>{
        localStorage.setItem('Alias', JSON.stringify(alias));
        setLoggedUser(alias)
    }
    const logout = ()=>{
        localStorage.removeItem('Alias');
        setLoggedUser('');
    }
    return(
        <AuthContext.Provider value={{loggedUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

};

export const useAuth = ()=>{
    return useContext(AuthContext);
}