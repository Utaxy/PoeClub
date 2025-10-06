import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from './Authcontext.jsx'
import { GoogleLogin } from "@react-oauth/google";



const login = ()=>{
    const [notify, setNotify] = useState('');
    const {login:authLogin} = useAuth();
    const nav = useNavigate();
    const API = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000' : '');

    const handleGoogleSuccess = async(credentialResponse)=>{
            try {
                
                const base64Url = credentialResponse.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c){
                    return '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''))

                const payload = JSON.parse(jsonPayload);
                const {sub: googleId} = payload;
                
                const response = await fetch(`${API}/api/google-login`,{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({
                        googleId: googleId
                    })
                });
                
                const data = await response.json();
                if(response.ok){
                    authLogin(data.alias, data.picture, data.admin);
                    setNotify('Login successful!');
                    setTimeout(()=>{
                        nav('/');
                    },1000)
                } else {
                    setNotify(data.message || 'Login failed');
                }
                
            } catch (error) {
                setNotify('Login error: ' + error.message);
            }
        }
        const handleGoogleError = ()=>{
            setNotify('Google auth failed. Please try again later.')
        }
        return(
            <div className="flex justify-center items-center min-h-screen bg-neutral-950">
                <div className="flex items-center flex-col border border-white w-96 mt-10 gap-6 rounded shadow-lg bg-neutral-800 p-8">
                    <div className="text-red-400 min-h-6 text-center">{notify}</div>
                        <>
                            <div className="text-3xl font-bold text-white text-center">Login to the PoeClub</div>
                            <div className="text-gray-300 text-center">If you want to post or see the authors you need to login</div>
                            <div className="w-full flex justify-center">
                                <GoogleLogin 
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    text="login_with"
                                    shape="rectangular"
                                    theme="filled_black"
                                    size="large"
                                    width="300"
                                />
                            </div>
                        </>
                </div>
            </div>
        )
    }
    
    


export default login;
