import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";



const Post = ()=>{
    const [post, setPost] = useState('');
    const [notify, setNotify] = useState('');
    const [file, setFile] = useState(null);
    const [mediaUrl, setMediaUrl] = useState('');
    const nav = useNavigate();
    const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    const handleSubmit = async(e)=>{
        const userAlias = localStorage.getItem('alias');
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset','poeclub');
            

            const response = await fetch("https://api.cloudinary.com/v1_1/dgaiwbr7r/auto/upload",{
                method:'POST',
                body: formData
            });
            const data = await response.json();
            setMediaUrl(data.secure_url);
            
            if(!post){
                setNotify('Please write a message for post');
                return; 
            }
            if(!userAlias){
                setNotify('Please log in!');
                return;
            }
             const responseP = await fetch(`${API}/api/post`,{
                method:'POST',
                headers:{'Content-type':'application/json',
                    'x-user-alias': userAlias
                },
                body: JSON.stringify({
                    post:post,
                    imgUrl:data.secure_url
                })
            })
            const dataP =await responseP.json();

            if(!dataP.success){
                console.error('Post error', data.error);
                setNotify(data.message || 'Post failed');
                return;
            }

            setNotify('Post created succesfully!');
            setPost('');
            setTimeout(()=>{
                nav('/')
            },1000)
        } catch (error) {
            console.error('error', data.error);
        }
    };


    return(
        <div className="flex flex-col justify-center items-center">
            <form className="flex items-center flex-col border border-white w-100 h-100 mt-10 gap-6 rounded shadow-lg bg-neutral-800">
                {notify ? <div>{notify}</div> : <></>}
                <label htmlFor="post" className="text-2xl text-white">Your message:</label>
                <input 
                    className=" text-2xl text-white w-100 h-50"
                    type="text"
                    placeholder="Say something:"
                    name="post"
                    value={post}
                    onChange={(e)=>setPost(e.target.value)}
                />
                <input
                    className="text-white" 
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e)=>{setFile(e.target.files[0])}}
                />
                {mediaUrl &&(
                    mediaUrl.endsWith('.mp4') ?(
                        <video width="320" controls src={mediaUrl}></video>
                    ): (
                        <img width='320' src={mediaUrl} />
                    )
                )}
                <button type='button'onClick={handleSubmit} className="flex border border-white text-2xl text-white cursor-pointer">Submit</button>
                

            </form>
        </div>
    )
}




export default Post;
