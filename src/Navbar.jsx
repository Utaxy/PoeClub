import { useEffect, useState } from 'react';
import crown from './assets/crown.webp'
import { useAuth } from './Authcontext.jsx';


const Navbar = ()=>{
    const {loggedUser, logout} = useAuth()
    return(
        <div className='flex justify-between items-center border border-white m-5 rounded-2xl'>
            <div className='flex justify-center gap-4 items-center'>
                <img className='h-25'src={crown}/>
                <a href='/' className='text-2xl text-white hover:text-gray-500'>Poe Club</a>
            </div>
            <div className='flex gap-50 items-center mr-10'>
                {loggedUser ? (
                    <>
                        <div className='text-2xl text-white'>Welcome {loggedUser} !</div> 
                        <button onClick={logout} className='text-2xl text-white hover:text-gray-500'>Logout</button>
                    </>
                ) : (
                    <>
                        <a href='/login' className='text-2xl text-white hover:text-gray-500'>Login</a> 
                        <a href='/register' className='text-2xl text-white hover:text-gray-500'>Register</a>
                    </>
                )}  
                
                <a href='/post' className='text-2xl text-white hover:text-gray-500'>Post</a>
            </div>
        </div>
    )

}


export default Navbar;