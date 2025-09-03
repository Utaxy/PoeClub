import { useState } from "react"




const register = ()=>{
    const [username, setUsername] = useState('');
    const [password, setPassword]= useState('');
    const [alias, setAlias]= useState('');
    const [notify, setNotify] = useState('');

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!username || !password || !alias){
            setNotify('You need to fill all the blanks');
        }else{
            fetch('http://localhost:8000/api/register', {
                method:'POST',
                headers:{'Content-type':'application/json'},
                body:JSON.stringify({username,password,alias})
        });
    }
}
    return(
        <div className="flex justify-center items-center min-h-screen bg-neutral-950">
            
            <form onSubmit={handleSubmit} className="flex items-center flex-col border border-white w-100 h-100 mt-10 gap-6 rounded shadow-lg bg-neutral-800">
                <div>{notify}</div>
                <div className="text-2xl font-bold">Register form:</div>
                <div className="flex gap-4 mt-10">
                    <label htmlFor="username" className="text-black" >Username:</label>
                    <input 
                        className="border border-white hover:border-sky-950 shadow-sm rounded placeholder:text-neutral-950"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <label htmlFor="alias" className="text-black">Alias:</label>
                    <input 
                        className="border border-white hover:border-sky-950 rounded placeholder:text-neutral-950"
                        type="text"
                        name="alias"
                        placeholder="Alias"
                        value={alias}
                        onChange={(e)=>setAlias(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <label htmlFor="password" className="text-black">Password:</label>
                    <input
                        className="border border-white hover:border-neutral-950 shadow-sm rounded placeholder:text-neutral-950"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                    />
                </div>
                <button 
                    type="submit"
                    className="mt-10 border border-white w-20 h-10 hover:border-sky-950 rounded shadow-md hover:shadow-lg text-black bg-neutral-400"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}



export default register;