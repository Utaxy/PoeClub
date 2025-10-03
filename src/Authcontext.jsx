
import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();

export const AuthProvider=({children})=>{
    const [loggedUser, setLoggedUser] = useState(null);
    const [storedPicture, setStoredPicture] = useState('');
    const [isAdmin, setIsAdmin] = useState(false)


    useEffect(()=>{
        if(localStorage.getItem('alias')){
            try {
                const storedAlias = localStorage.getItem('alias');
                const storedPicture = localStorage.getItem('picture');
                const storedIsAdmin = localStorage.getItem('admin');
                setStoredPicture(storedPicture);
                setLoggedUser(storedAlias);
                setIsAdmin(JSON.parse(storedIsAdmin));
            } catch (error) {
                console.error(error);
            }
        }
    },[]);

    const login = (alias, picture, admin)=>{
        localStorage.setItem('alias', alias);
        localStorage.setItem('picture',picture);
        localStorage.setItem('admin', JSON.stringify(admin));
        setLoggedUser(alias);
        setStoredPicture(picture);
        setIsAdmin(admin);
    }
    const logout = ()=>{
        localStorage.removeItem('alias');
        localStorage.removeItem('picture');
        localStorage.removeItem('admin')
        setLoggedUser(null);
        setStoredPicture('')
        setIsAdmin(false)
    }
    return(
        <AuthContext.Provider value={{loggedUser, login, logout, storedPicture, isAdmin}}>
            {children}
        </AuthContext.Provider>
    )

};

export const useAuth = ()=>{
    return useContext(AuthContext);
}
