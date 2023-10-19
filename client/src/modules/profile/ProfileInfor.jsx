import React from "react";
import ButtonFollowingUser from "../../components/button/ButtonFollowingUser";

const ProfileInfor = ({setShow, user, isfollowed, username}) =>
{

    const profile = user
    // console.log(profile);
    return (<>
        <div className="mb-8">
            <div className="w-20 h-20 rounded-1/2 overflow-hidden ">
                <img className="w-full h-full" src={profile?.avatar} alt="" />
            </div>
            <p className="my-4">{profile?.fullname}</p>
            <p className="mb-4">{profile?.bio ? profile.bio :""} </p>
            <p className="mb-4">{profile?.about ? profile.about : ""}</p>
            {
            user.isMe?
            <button className="text-green-500 duration-300 hover:text-black" onClick={()=>setShow(true)}>Edit Profile</button>
            :
            <div className="flex items-center">
                <ButtonFollowingUser username={username} initialFollowing={isfollowed} />
                <button className="w-9 h-9 ml-2 rounded-1/2 overflow-hidden bg-green-600"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 m-auto text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg></button>
            </div>
            }
        </div>
    </>)

}

export default ProfileInfor;