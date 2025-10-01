
import crown from './assets/crown.webp'
import { useAuth } from './Authcontext.jsx';


const Navbar = ()=>{
    const {loggedUser, logout, storedPicture} = useAuth()
    return(
        <div className='flex flex-col sm:flex-row justify-between items-center border border-white m-2 sm:m-5 rounded-2xl p-3 sm:p-4 gap-4 sm:gap-0'>
            <div className='flex justify-center gap-2 sm:gap-4 items-center'>
                <img className='h-8 sm:h-12 lg:h-16 w-8 sm:w-12 lg:w-16 object-contain' src={crown}/>
                <a href='/' className='text-lg sm:text-xl lg:text-2xl text-white hover:text-gray-500 font-semibold'>Poe Club</a>
            </div>
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-6 lg:gap-8 items-center'>
                {loggedUser ? (
                    <>
                        <div className='flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 sm:gap-4 text-center sm:text-left'>
                            <img src={storedPicture} className='rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16'></img>
                            <div className='text-sm sm:text-lg lg:text-xl text-white'>Welcome <span className='font-semibold text-blue-400'>{loggedUser}</span>!</div>
                        </div>
                        <a href='/profile' className='text-sm sm:text-lg lg:text-xl text-white hover:text-blue-400 transition-colors duration-200 px-3 py-1 border border-transparent hover:border-blue-400 rounded'>Profile</a>     
                        <button onClick={logout} className='text-sm sm:text-lg lg:text-xl text-white hover:text-red-400 transition-colors duration-200 px-3 py-1 border border-transparent hover:border-red-400 rounded'>Logout</button>
                    </>
                ) : (
                    <>
                        <a href='/login' className='text-sm sm:text-lg lg:text-xl text-white hover:text-blue-400 transition-colors duration-200 px-3 py-1 border border-transparent hover:border-blue-400 rounded'>Login</a> 
                        <a href='/register' className='text-sm sm:text-lg lg:text-xl text-white hover:text-green-400 transition-colors duration-200 px-3 py-1 border border-transparent hover:border-green-400 rounded'>Register</a>
                    </>
                )}  
                
                <a href='/post' className='text-sm sm:text-lg lg:text-xl text-white hover:text-purple-400 transition-colors duration-200 px-3 py-1 border border-transparent hover:border-purple-400 rounded font-medium'>Post</a>
            </div>
        </div>
    )

}


export default Navbar;
