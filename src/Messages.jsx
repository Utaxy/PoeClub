import { useEffect, useState } from "react"
import { useAuth } from "./Authcontext.jsx";
import eap from './assets/eap.png'





const Messages = ()=>{
    const [messages, setMessages] = useState([]);
    const {loggedUser} = useAuth();

    useEffect(()=>{
        const fetchMessages = async()=>{
            try {
                const response = await fetch('http://localhost:8000/api/messages',{
                    method:'GET',
                    headers:{'Content-type':'application/json'}
                })
                const data = await response.json();
                if(data.success){
                    setMessages(data.data);
                }else{
                    console.error('Error:', data.message);
                }

            } catch (error) {
                console.error('Error:', error)
            }
        };
        fetchMessages();
    },[]);

    
    return(
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-20 mt-5">
                <img src={eap}></img>
                {messages.length===0 ? (
                    <div className="text-2xl text-white">No messages found!</div>
                ): (
                    messages.map((message)=>(
                        <div key={message.id} className="flex flex-col border border-white w-200 h-60 rounded p-4 overflow-y-auto break-words">
                            {loggedUser ? (
                                <div className="flex flex-col gap-25">
                                    <div>
                                        <div key={'alias'} className="text-2xl text-white">{message.alias}:</div>
                                        <div key={'aliasWithMessage'} className="text-2xl text-white">{message.message}</div>
                                    </div>
                                    <div>
                                        <div key={'createdAt'} className="text-2xl text-white">{new Date(message.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                            ): (
                                <>
                                    <div key={'anon'} className="text-2xl text-white">Anonymous: </div>
                                    <div key={'anonMessage'} className="text-2xl text-white">{message.message}</div>
                                </>
                            )}
                        </div>
                    ))

                )}
            </div>
        </div>
    )
}



export default Messages;