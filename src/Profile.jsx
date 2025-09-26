import { useAuth } from "./Authcontext.jsx";


const Profile = ()=>{
const { storedPicture,loggedUser } = useAuth();
  return(
    <div>
      <div className="flex item-center justify-center border border-white">
        <div className="border border-white">
          <img src={ storedPicture } className="rounded-full"></img>
          <div className="text-white">{loggedUser}</div>
        </div>
      </div>
    </div>
  )
}

export default Profile;
