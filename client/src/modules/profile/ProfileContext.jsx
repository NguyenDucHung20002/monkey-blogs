import { Popover } from "antd";
import React, { useEffect, useState } from "react";
import { apiBlockUser, apiMuteUser } from "../../api/api";
import { toast } from "react-toastify";

const More =({handleMute,isMuted,handleBlock,isBlock,handleCopyToClipboard})=>{
    return (
        <>
        <div className=" text-stone-500">
            <div onClick={handleCopyToClipboard} className="cursor-pointer p-1 hover:text-black">Copy link to profile</div>
            <div onClick={handleMute} className="cursor-pointer p-1 hover:text-black">{isMuted ? "UnMute":"Mute"} this author</div>
            <div onClick={handleBlock} className="cursor-pointer p-1 hover:text-black">{isBlock ? "Unblock":"Block"} this author</div>
            <div className="cursor-pointer p-1 hover:text-black">Report this author</div>
        </div>
        </>
    )
}
const MoreMe =({handleCopyToClipboard})=>{
    return (
        <>
        <div className=" text-stone-500">
            <div onClick={handleCopyToClipboard} className="cursor-pointer p-1 hover:text-black">Copy link to profile</div>
        </div>
        </>
    )
}
const ProfileContext = ({user,token}) =>
{
    const [isMuted,setMuted] = useState(false)
    const [isBlock,setBlock] = useState(false)
    useEffect(()=>{
        setMuted(user?.isMuted)
        setBlock(user?.isBlocked)
    },[user])
    const handleCopyToClipboard =async ()=>{
        try {
            const currentURL = window.location.href;
            await navigator.clipboard.writeText(currentURL);
            toast.success("Copy to ClipBoard successfully!", {
                pauseOnHover: false,
                delay: 500,
              });
        } catch (error) {
            console.error('error when add clipboard:');
        }
    }
    const handleMute = async()=>{
        const type = isMuted ? "delete" : "post";
        const res = await apiMuteUser(type,token,user.id)
        if(res){
            setMuted(!isMuted)
        }
    }
    const handleBlock = async()=>{
        const type = isBlock ? "delete" : "post";
        const res = await apiBlockUser(type,token,user.id)
        if(res){
            setBlock(!isBlock)
        }
    }
    return (<>
        <div className="w-full py-8">
            <div className="w-full h-20 py-4 flex items-center justify-between">
                <div className="text-[25px] text-black py-3 font-bold" >{user.fullname}</div>
                <div className="">
                    <Popover trigger={"click"} 
                        content={
                            user?.isMyProfile ? 
                            <MoreMe handleCopyToClipboard={handleCopyToClipboard}/>
                            :
                            <More handleMute={handleMute} isMuted={isMuted} isBlock={isBlock} handleBlock={handleBlock} handleCopyToClipboard={handleCopyToClipboard}/>
                        } 
                        placement="bottom"
                    >
                        <button className="">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.6-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
                            fill="currentColor"
                            ></path>
                        </svg>
                        </button>
                    </Popover>
                </div>
            </div>
            <div className="px-[1px] text-sm border-b border-stone-300 border-collapse box-border h-[53px]">
                <div className="inline-block py-4 border-b border-stone-800 ">Home</div>
            </div>

        </div>
    </>)
}

export default ProfileContext;