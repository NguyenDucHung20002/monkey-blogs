import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import FollowingUserHandle from "../../components/following/FollowingUserHandle";
import { apiGetUserFollow } from "../../api/apiNew";



const ProfileFollowing =()=>{
  const [followings, setFollowings] = useState([])
  const { username } = useParams();
  async function fetchUserFollow() {
    const dataFollow = await apiGetUserFollow(username,"following");
    if(!dataFollow?.success){
      console.log("error api:",dataFollow?.message);
    }
    setFollowings(dataFollow?.data);
  }
  useEffect(()=>{
    fetchUserFollow()
  },[])
  return (<>
  {
    followings.length == 0 ? 
      (<h1></h1>) 
      :
      followings.map((val,idx)=>(
        <FollowingUserHandle key={idx} data={val} initialFollowing={val?.isFollowed}/>
      ))
  }
  </>)
}

export default ProfileFollowing;