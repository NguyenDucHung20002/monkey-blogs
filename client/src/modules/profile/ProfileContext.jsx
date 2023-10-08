import React from "react";

const ProfileContext = ({user}) =>
{

    return (<>
        <div className="w-full h-full py-8 px-16">
            <div className="w-full h-20 py-4 flex items-center justify-between">
                <div className="text-[25px] text-black py-3" >Name</div>
                <div className="text-[40px] text-stone-500">...</div>
            </div>
            <div className="px-[1px] text-sm border-b border-stone-300 border-collapse box-border h-[53px]">
                <div className="inline-block py-4 border-b border-stone-800 ">Home</div>
            </div>

            <div className="flex bg-neutral-50 mt-11 border border-neutral-50 rounded-lg overflow-hidden">
                <div className="w-2/4 p-6">
                    <div className="flex">
                        <div className="w-6 h-6 rounded-1/2 overflow-hidden">
                            <img className="w-full h-full " src={user.avatar} alt="" />
                        </div>
                        <div className="flex items-center justify-between px-2">Name</div>
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
            </div>
        </div>
    </>)
}

export default ProfileContext;