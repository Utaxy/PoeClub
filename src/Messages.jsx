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

    const handleLike = async(messageId)=>{
       try {
        const response = await fetch('http://localhost:8000/api/messages/likes',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                messageId:messageId,
                userId: loggedUser
            })
        });
        const data = await response.json()
        if(response.ok){
            setMessages(prevMessages=>prevMessages.map(message=>
                messageId === message.id ? {...message, likes:data.LikeCount}:
                message))
        }else{
            console.error('Like error', data.message);
            alert(data.message);
        }
       } catch (error) {
            console.error('Like error', error);        
       }
    }

    
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
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <div key={'alias'} className="text-2xl text-white">{message.alias}:</div>
                                        <div key={'aliasWithMessage'} className="text-2xl text-white">{message.message}</div>
                                    </div>
                                    <div>
                                        <div key={'createdAt'} className="text-2xl text-white">{new Date(message.created_at).toLocaleString()}</div>
                                    </div>
                                    <div className="flex gap-4 mt-3">
                                        <button
                                        onClick={()=>handleLike(message.id)}
                                        className="group flex items-center gap-2 px-4 py-2 bg-transparent border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">
                                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                            <span className="text-sm font-medium">{message.likes}</span>
                                        </button>
                                        <button className="group flex items-center gap-2 px-4 py-2 bg-transparent border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">
                                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span className="text-sm font-medium"></span>
                                        </button>
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