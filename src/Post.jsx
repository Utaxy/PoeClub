import { useState } from "react"
import { useNavigate } from "react-router-dom";



const Post = ()=>{
    const [post, setPost] = useState('');
    const [notify, setNotify] = useState('');
    const nav = useNavigate();

    const handleSubmit = async(e)=>{
        const userAlias = localStorage.getItem('Alias');
        e.preventDefault();
        if(!post){
            setNotify('Please write a message for post');
            return; 
        }
        if(!userAlias){
            setNotify('Please log in!');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:8000/api/post',{
                method:'POST',
                headers:{'Content-type':'application/json',
                    'x-user-alias': JSON.parse(userAlias)
                },
                body: JSON.stringify({post:post})
            })
            const data =await response.json();

            if(!response.ok){
                console.error('Post error', data.message);
                setNotify(data.message || 'Post failed');
                return;
            }

            setNotify('Post created succesfully!');
            setPost('');
            setTimeout(()=>{
                nav('/')
            },1000)
        } catch (error) {
            console.error(error)
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
                <button onClick={handleSubmit} className="flex border border-white text-2xl text-white cursor-pointer">Submit</button>
            </form>
        </div>
    )
}




export default Post;