import { useEffect, useState } from "react"
import { useAuth } from "./Authcontext.jsx";
import eap from './assets/eap.png'

const Messages = ()=>{
    const [messages, setMessages] = useState([]);
    const {loggedUser} = useAuth();
    const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    useEffect(()=>{
        const fetchMessages = async()=>{
            try {
                const response = await fetch(`${API}/api/messages`,{
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
        const response = await fetch(`${API}/api/messages/likes`,{
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
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-8 sm:gap-12 lg:gap-20 mt-5 w-full max-w-4xl">
                <img src={eap} className="w-32 h-32 sm:w-40 sm:h-40 lg:w-auto lg:h-auto object-contain"></img>
                {messages.length===0 ? (
                    <div className="text-lg sm:text-xl lg:text-2xl text-white text-center">No messages found!</div>
                ): (
                    messages.map((message)=>(
                        <div key={message.id} className="flex flex-col border border-white w-full max-w-3xl min-h-[200px] sm:min-h-[240px] lg:h-60 rounded-lg p-3 sm:p-4 lg:p-6 overflow-y-auto break-words bg-neutral-800/50 backdrop-blur-sm">
                            {loggedUser ? (
                                <div className="flex flex-col gap-3 sm:gap-4 h-full">
                                    <div className="flex-grow">
                                        <div key={'alias'} className="text-lg sm:text-xl lg:text-2xl text-blue-400 font-semibold mb-2">{message.alias}:</div>
                                        <div key={'aliasWithMessage'} className="text-base sm:text-lg lg:text-xl text-white leading-relaxed">{message.message}</div>
                                    </div>
                                    <div className="mt-auto">
                                        <div key={'createdAt'} className="text-sm sm:text-base lg:text-lg text-gray-300 mb-3">{new Date(message.created_at).toLocaleString()}</div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <button
                                        onClick={()=>handleLike(message.id)}
                                        className="group flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-transparent border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer w-full sm:w-auto">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                            <span className="text-sm font-medium">{message.likes} Like{message.likes !== 1 ? 's' : ''}</span>
                                        </button>
                                        <button className="group flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-transparent border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer w-full sm:w-auto">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span className="text-sm font-medium">Comment</span>
                                        </button>
                                    </div>
                                </div>
                            ): (
                                <>
                                    <div key={'anon'} className="text-lg sm:text-xl lg:text-2xl text-gray-400 font-semibold mb-2">Anonymous: </div>
                                    <div key={'anonMessage'} className="text-base sm:text-lg lg:text-xl text-white leading-relaxed">{message.message}</div>
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