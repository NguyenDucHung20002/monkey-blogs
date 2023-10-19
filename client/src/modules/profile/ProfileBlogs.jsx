import React from "react";
import Topic from "../topic/Topic";
import { Link } from "react-router-dom";
import { Popover,Tooltip  } from 'antd';
const ProfileBlogs = ({blogs, user, fetchDeleteArticle})=>{
  const handleDelete = (slug)=>{
    fetchDeleteArticle(slug)
  }
  const MoreUser = ({slug})=>{
    return(
      <div>
        <div className="my-2 ">Edit story</div>
        <div className="my-2 ">Pin story</div>
        <div className="my-2 bg-stone-400 h-[1px]"></div>
        <div className="my-2 ">Story settings</div>
        <div className="my-2 ">Story stats</div>
        <div className="my-2 bg-stone-400 h-[1px]"></div>
        <div className="my-2 ">Hide responses</div>
        <div onClick={()=>handleDelete(slug)} className="my-2 cursor-pointer text-red-500">Delete story</div>
      </div>
    )
  }
  const MoreUserOther =()=>{
    return (
      <div>
        <div className="my-2 ">Report this story</div>
        <div className="my-2 ">Mute this author</div>
        <div className="my-2 bg-stone-400 h-[1px]"></div>
        <div className="my-2 ">Block this author</div>
        <div className="my-2 ">Report this author</div>
      </div>
    )
  } 
  const save = (
    <div>
      <div className="my-2 ">Reading list</div>
      <div className="my-2 ">List 1</div>
      <div className="my-2 bg-stone-400 h-[1px]"></div>
      <div className="my-2 ">Create new list</div>
    </div>
  )
  if(blogs.length==0){
    return(
      <div className="flex bg-neutral-50 mt-11 border border-neutral-50 rounded-lg overflow-hidden">
          <div className="w-2/4 p-6">
              <div className="flex">
                  <div className="w-6 h-6 rounded-1/2 overflow-hidden">
                      <img className="w-full h-full " src={user.profile?.avatar} alt="" />
                  </div>
                  <div className="flex items-center justify-between px-2">{user.profile?.fullname}</div>
              </div>
              <h1 className="py-5 font-bold text-xl">Reading Story</h1>
              <div className="flex justify-between">
                  <p className="">No Story</p>
                  <button className="text-lg">...</button>
              </div>
          </div>
          <div className="flex w-2/4 bg-white">
              <div className="bg-neutral-200 h-full w-1/2"></div>
              <div className="bg-neutral-200 h-full w-1/3 mx-[2px]"></div>
              <div className="bg-neutral-200 h-full flex-1"></div>
          </div>
      </div> )
    }
  return (<>
  {blogs.map((val,idx)=>(
    <div key={val._id} className="h-64 border-b pt-6">
      <div className="">
        <p className="text-sm">2 days ago</p>
      </div>
      <div className="flex mt-3">
        <div className="flex-1">
          <h2 className="text-xl font-bold pb-1">{val.title}</h2>
          <Link to={`/blog/${val.slug}`}><p className="line-clamp-3 text-sm">{val.preview} </p></Link>
          <div className="py-7 flex items-center justify-between">
            {val.Topic?.[0] ? (<Topic children={val.Topic?.[0]} className="!text-sm !font-medium !pt-1" to="cc"/>):(<div></div>)}
            {/* <Topic children={'val.Topic?.[0]'} className="!text-sm !font-medium !pt-1" to={'cc'}/> */}
            <div className="flex items-center">
            <Popover placement="bottom" content={save} trigger={"click"}>
              <button className="mx-5">
                  <svg className="" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z" fill="#000"></path></svg>
              </button>
              </Popover>
              <Popover placement="bottom" content={user.isMe ? <MoreUser slug={val.slug}/> : <MoreUserOther/>} trigger={"click"}>
                  <button>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.6-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z" fill="currentColor"></path></svg>
                  </button>
              </Popover>
            </div>
          </div>
        </div>
        <div className="ml-14">
          <Link to={`/blog/${val.slug}`}><img className="h-28 w-28" src={val.img} alt="" /></Link>
        </div>
      </div>
    </div>
  ))}
  </>)
}

export default ProfileBlogs