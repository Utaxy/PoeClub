import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import {GoogleLogin} from '@react-oauth/google';
import {useAuth} from './Authcontext.jsx'




const register = ()=>{
    const [alias, setAlias] = useState('');
    const [notify, setNotify] = useState('');
    const [showAliasForm, setShowAliasForm] = useState(false);
    const [googleUserData, setGoogleUserData] = useState(null);
    const nav = useNavigate();
    const {login:authLogin} = useAuth();
    const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const handleGoogleSuccess = async(credentialResponse) =>{
        try {
            const base64Url = credentialResponse.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g,  '+').replace(/_/g,'/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c){
                return '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''))

            const payload = JSON.parse(jsonPayload);
            const {email, name, picture, sub:googleId} = payload

            setGoogleUserData({
                email,
                name,
                picture,
                googleId
            });

            setShowAliasForm(true);
            setNotify(`Hello ${name}! Please write an alias for the display`)
        } catch (error) {
            setNotify('Google auth error' + error.message);
        }
    };
    
    const completeRegistration = async (e) =>{
        e.preventDefault();


        if(!alias.trim()){
            setNotify('Please write an alias');
            return;
        }

        try {
            const response = await fetch(`${API}/api/google-register`, {
                method:'POST',
                headers: {'Content-type':'application/json'},
                body: JSON.stringify({
                    ...googleUserData,
                    alias: alias.trim()
                })
            });
            const data = await response.json();
            if(response.ok){
                setNotify('Registration successful. Redirecting.')
                authLogin(data.alias)
                setTimeout(()=>{
                    nav('/')
                }, 2000)
            }else{
                setNotify(data.message||'Server error');
            }
        } catch (error) {
            setNotify('Registration failed' + error.message);
        }
    };
    
    const handleGoogleError = ()=>{
        setNotify('Registration with google failed. Please try again later.')
    }


    const resetForm = ()=>{
        setShowAliasForm(false);
        setGoogleUserData(null);
        setAlias('');
        setNotify('');
    };

    return(
        <div className="flex justify-center items-center min-h-screen bg-neutral-950">
            <div className="flex items-center flex-col border border-white w-96 mt-10 gap-6 rounded shadow-lg bg-neutral-800 p-8">
                <div className="text-red-400 min-h-6 text-center">{notify}</div>
                {!showAliasForm ? (
                    <>
                        <div className="text-3xl font-bold text-white text-center">Join the PoeClub</div>
                        <div className="text-gray-300 text-center">You can easily register with Google Account</div>
                        <div className="w-full flex justify-center">
                            <GoogleLogin 
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                text="signup_with"
                                shape="rectangular"
                                theme="filled_black"
                                size="large"
                                width="300"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {googleUserData &&(
                            <div className="flex flex-col items-center gap-4">
                                <img 
                                    src={googleUserData.picture}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full border-2 border-white"
                                />
                                <div className="text-white text-center">
                                    <div className="font-bold">{googleUserData.name}</div>
                                    <div className="text-gray-300 text-sm">{googleUserData.email}</div>
                                </div>
                            </div>
                        )}
                        <form onSubmit={completeRegistration} className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="alias" className="text-white font-semibold">Write your desired alias</label>
                                <input 
                                    className="border border-white hover:border-blue-500 rounded placeholder:text-gray-500 px-3 py-2 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    name="alias"
                                    placeholder="Exmp:GothFather123"
                                    value={alias}
                                    onChange={(e)=>setAlias(e.target.value)}
                                    maxLength="30"
                                    autoFocus
                                />
                                <div className="text-gray-400 text-xs">
                                    This name is gonna be visible by others
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 border border-gray-500 py-2 px-4 rounded text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-blue-600 py-2 px-4 rounded text-white hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
    
       



export default register;