import {useEffect, useState } from "react"
import { useAuth } from "./Authcontext.jsx";
import eap from './assets/eap.png'

const Messages = ()=>{
    const [messages, setMessages] = useState([]);
    const [userComment, setUserComment] = useState('');
    const [openCommentFor, setOpenCommentFor] = useState(null);
    const [comments, setComments] = useState([])
    const {loggedUser} = useAuth();
    const [notify ,setNotify] = useState('');
    const [postPicture, setPostPicture] = useState([]);
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
    },[API]);
    
    useEffect(()=>{
        const fetchComments = async()=>{
            try {
                const response = await fetch(`${API}/api/messages/comments`,{
                    method:'GET',
                    headers:{'Content-type':'application/json'}
                })
                const data = await response.json();

                if(data.success){
                    setComments(data.data)
                }else{
                    console.error('error',data.message)
                }
            } catch (error) {
                console.error('Error:',error)
            }
        }
        fetchComments();
    },[API]);

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
    
    const openCommentInput = (messageId)=>{
        setOpenCommentFor(messageId);
        setNotify(''); // Clear any previous notifications
    }
    
    const closeCommentInput=()=>{
        setOpenCommentFor(null);
        setUserComment(''); // Clear comment input
        setNotify(''); // Clear notifications
    }
    
    const commentSubmit = async (messageId, e) => {
        e.preventDefault();
        if(!userComment.trim()){
            return setNotify('You need to write something to submit')
        }
        try {
            const response = await fetch(`${API}/api/messages/comments`,{
                method:'POST',
                headers:{'Content-type':'application/json'},
                body:JSON.stringify({
                    comment:userComment,
                    userId: loggedUser,
                    messageId:messageId
                })
            })
            const data = await response.json()
            
            if(data.success) {
                // Refresh comments after successful submission
                const commentsResponse = await fetch(`${API}/api/messages/comments`,{
                    method:'GET',
                    headers:{'Content-type':'application/json'}
                })
                const commentsData = await commentsResponse.json();
                if(commentsData.success){
                    setComments(commentsData.data)
                }
                
                // Close comment input and clear form
                setUserComment('');
                setOpenCommentFor(null);
                setNotify('');
            } else {
                setNotify(data.message || 'Failed to submit comment');
            }
        } catch (error) {
            console.error('Server error: ', error);
            setNotify('Failed to submit comment. Please try again.');
        }
    }

    return(
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-8 sm:gap-12 lg:gap-20 mt-5 w-full max-w-4xl">
                <img src={eap} className="w-32 h-32 sm:w-40 sm:h-40 lg:w-auto lg:h-auto object-contain" alt="Logo" />
                {messages.length === 0 ? (
                    <div className="text-lg sm:text-xl lg:text-2xl text-white text-center">No messages found!</div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className="flex flex-col border border-white w-full max-w-5xl rounded-lg bg-neutral-800/50 backdrop-blur-sm overflow-hidden max-h-[400px] md:max-h-[520px] lg:max-h-[640px]"
                        >
                            {/* Scrollable content area */}
                            <div className="p-3 md:p-6 lg:p-8 flex-1 overflow-auto">
                                {loggedUser ? (
                                    <>
                                        <div className="mb-2">
                                            <div className="flex items-center gap-4">
                                                <img className='rounded-full w-15 h-15' src={message.picture}/>
                                                <div className="text-lg sm:text-xl lg:text-2xl text-blue-400 font-semibold">{message.alias}:</div>
                                            </div>
                                            <div className="text-base sm:text-lg lg:text-xl text-white leading-relaxed whitespace-pre-wrap">{message.message}</div>
                                        </div>

                                        <div className="text-sm sm:text-base lg:text-lg text-gray-300 mb-3">
                                            {new Date(message.created_at).toLocaleString()}
                                        </div>

                                        {/* Comments list */}
                                        <div className="mt-3 space-y-2">
                                            {(comments.filter(c => c.message_id === message.id) || []).map(c => (
                                                <div key={c.id} className="pl-4 border border-white/10 rounded p-2 bg-neutral-900/30 break-words">
                                                    <div className="flex items-center gap-4">
                                                        <img className='rounded-full w-7 h-7' src={c.picture}/>
                                                        <div className="text-xs text-gray-300">{c.user_alias} · {new Date(c.created_at).toLocaleString()}</div>
                                                    </div>
                                                    <div className="text-sm text-white whitespace-pre-wrap">{c.comment}</div>
                                                </div>
                                            ))}
                                        </div>

                                          {/* Action buttons */}
                            <div className="p-3 md:px-6 md:py-4 border-t border-white/10 flex gap-3 items-center">
                                <button
                                    onClick={() => handleLike(message.id)}
                                    className="group flex items-center gap-2 px-3 py-2 bg-transparent border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                    <span className="text-sm font-medium">{message.likes ?? 0} Like{(message.likes ?? 0) !== 1 ? 's' : ''}</span>
                                </button>

                                <button
                                    onClick={() => openCommentInput(message.id)}
                                    className="group flex items-center gap-2 px-3 py-2 bg-transparent border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span className="text-sm font-medium">Comment</span>
                                </button>
                            </div>

                            {/* Comment form */}
                            {openCommentFor === message.id && (
                                <form onSubmit={(e) => commentSubmit(message.id, e)} className="p-3 md:px-6 md:py-4 border-t border-white/10 bg-neutral-900/30">
                                    <div className="flex flex-col gap-3">
                                        {notify && <div className="text-sm text-red-300">{notify}</div>}
                                        <input
                                            className="w-full p-2 rounded bg-neutral-800 text-white border border-white/10"
                                            type="text"
                                            name="comment"
                                            placeholder="Your comment..."
                                            value={userComment}
                                            onChange={(e) => setUserComment(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">Submit</button>
                                            <button type="button" onClick={closeCommentInput} className="px-3 py-1 border rounded">Cancel</button>
                                        </div>
                                    </div>
                                </form>
                            )}

                                    </>
                                ) : (
                                    <>
                                        <div className="text-lg sm:text-xl lg:text-2xl text-gray-400 font-semibold mb-2">Anonymous:</div>
                                        <div className="text-base sm:text-lg lg:text-xl text-white leading-relaxed whitespace-pre-wrap">{message.message}</div>
                                    </>
                                )}
                            </div>

                                                  </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Messages;
