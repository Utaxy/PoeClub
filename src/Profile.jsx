import { useEffect, useState } from "react";
import { useAuth } from "./Authcontext.jsx";


const Profile = ()=>{
const { storedPicture,loggedUser } = useAuth();
const [userMessages, setUserMessages] = useState([]);
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
useEffect(()=>{
    const f = async ()=>{
    const x = await fetch(`${API}/api/usermessages`,{
      method:'POST',
      headers:{'Content-type':'application/json'},
      body:JSON.stringify({alias:loggedUser})
    })
    const data = await x.json();
    if(data.success){
      return setUserMessages(data.data)
      
    }
  }
  f();
 
},[loggedUser])
  console.log(userMessages);
  return(
    <div>
      <div className="flex  items-center justify-center border border-white">
        <div className="border border-white flex flex-col items-center justify-center gap-5">
          <img src={ storedPicture } className="rounded-full w-50 h-50"></img>
          <div className="text-white text-5xl text-white ">{loggedUser}</div>
        </div>
      </div>
    
    {userMessages.map(message=>
      <div className='text-white'key={message.id}>
          {message.message} 
      </div>
  )}
    </div>
  
  )
}

export default Profile;
