import { useState } from "react"
import { useNavigate } from "react-router-dom";

const Post = ()=>{
    const [post, setPost] = useState('');
    const [notify, setNotify] = useState('');
    const [file, setFile] = useState(null);
    const [mediaUrl, setMediaUrl] = useState('');
    const nav = useNavigate();
    const API = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000' : '');

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const userAlias = localStorage.getItem('alias');

        if(!post){
            setNotify('Please write a message for post');
            return; 
        }
        if(!userAlias){
            setNotify('Please log in!');
            return;
        }

        try {
            let uploadedUrl = '';

            // Upload to Cloudinary only if a file was selected
            if(file){
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset','poeclub');

                const response = await fetch("https://api.cloudinary.com/v1_1/dgaiwbr7r/auto/upload",{
                    method:'POST',
                    body: formData
                });

                const data = await response.json();
                if(!response.ok){
                    console.error('Cloudinary upload failed', data);
                    setNotify('Media upload failed');
                    return;
                }
                uploadedUrl = data.secure_url;
                setMediaUrl(uploadedUrl);
            }

            const responseP = await fetch(`${API}/api/post`,{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'x-user-alias': userAlias
                },
                body: JSON.stringify({
                    post: post,
                    imgUrl: uploadedUrl
                })
            });

            const dataP = await responseP.json();

            if(!dataP.success){
                console.error('Post error', dataP);
                setNotify(dataP.message || 'Post failed');
                return;
            }

            setNotify('Post created successfully!');
            setPost('');
            setFile(null);
            setTimeout(()=> nav('/'), 1000);

        } catch (error) {
            console.error('error', error);
            setNotify('An unexpected error occurred');
        }
    };


    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-neutral-800 p-6">
            <form 
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl text-white flex flex-col gap-6"
            >
                {/* Notification */}
                {notify && (
                    <div className="px-4 py-2 bg-neutral-800 text-sm rounded-md text-yellow-200 border border-yellow-800">
                        {notify}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Create a post</h2>
                </div>

                <label htmlFor="post" className="text-sm text-neutral-300">Your message</label>
                <textarea
                    id="post"
                    className="w-full min-h-[96px] resize-none bg-neutral-950 border border-neutral-800 rounded-md p-3 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Say something..."
                    name="post"
                    value={post}
                    onChange={(e)=>setPost(e.target.value)}
                />

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-10 flex items-center justify-center bg-neutral-800 border border-neutral-700 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m-2 4h12" /></svg>
                        </div>
                        <span className="text-sm text-neutral-300">Add image / video</span>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e)=>{ setFile(e.target.files?.[0] || null) }}
                            className="hidden"
                        />
                    </label>

                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-xs text-neutral-400">{post.length}/1000</span>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-md text-sm font-medium shadow-lg cursor-pointer"
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Preview */}
                {(mediaUrl || file) && (
                    <div className="mt-2">
                        <label className="text-sm text-neutral-300">Preview</label>
                        <div className="mt-2 bg-neutral-950 border border-neutral-800 rounded-lg p-3 flex items-center justify-center">
                            {mediaUrl ? (
                                mediaUrl.endsWith('.mp4') ? (
                                    <video className="max-w-full rounded-md" controls src={mediaUrl} />
                                ) : (
                                    <img className="max-w-full rounded-md" src={mediaUrl} alt="preview" />
                                )
                            ) : file ? (
                                // temporary local preview if no uploaded url yet
                                file.type.startsWith('video') ? (
                                    <video className="max-w-full rounded-md" controls src={URL.createObjectURL(file)} />
                                ) : (
                                    <img className="max-w-full rounded-md" src={URL.createObjectURL(file)} alt="preview" />
                                )
                            ) : null}
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

export default Post;