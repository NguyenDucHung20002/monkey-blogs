import React from "react";

const ProfileInfor = ({setShow, user}) =>
{
    console.log(user);
    return (<>
        <div className="w-full h-screen p-8 border-l border-l-gray-300 text-gray-500 ">
            <div className="w-20 h-20 rounded-1/2 overflow-hidden ">
                <img className="w-full h-full" src={user.avatar} alt="" />
            </div>
            <p className="my-4">{user.fullname}</p>
            <p className="mb-4">{user?.bio ? user.bio :""} </p>
            <p className="mb-4">{user?.about ? user.about : ""}</p>
            <button className="text-green-500 duration-300 hover:text-black"
            onClick={()=>setShow(true)}
            >Edit Profile</button>
        </div>
    </>)

}

export default ProfileInfor;