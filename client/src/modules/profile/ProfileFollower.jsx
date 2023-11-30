import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { NavbarHome } from "../../components/navbar";
import { apiGetUserFollow } from "../../api/apiNew";
import FollowingUserHandle from "../../components/following/FollowingUserHandle";


const ProfileFollower =()=>{
  const [followers, setFollower] = useState([])
  const { username } = useParams();
  async function fetchUserFollow() {
    const dataFollow = await apiGetUserFollow(username,"followers");
    if(!dataFollow?.success){
      console.log("error api:",dataFollow?.message);
    }
    setFollower(dataFollow?.data);
  }
  useEffect(()=>{
    fetchUserFollow()
  },[])
  return (<>
  {
    followers.length == 0 ? 
      (<h1></h1>) 
      :
      followers.map((val,idx)=>(
        <FollowingUserHandle key={idx} data={val} initialFollowing={val?.isFollowed}/>
      ))
  }
  </>)
}

export default ProfileFollower;