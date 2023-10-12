import React from "react";

const TopicDisplay =()=>{

	return(<>
		<div className="w-full h-[200px] my-12 text-center border-b border-l-stone-300">
			<h2 className="text-4xl font-bold ">Careers</h2>
			<div className=" my-6 flex items-center justify-center">
				Topic 
				<div className="mx-1 -translate-y-1">.</div>
				181k Followers
				<div className="mx-1 -translate-y-1">.</div>
				111k Stories
			</div>
			<div className="">
				<button className="py-2 px-4 rounded-3xl bg-black text-white text-sm">Follow</button>
			</div>
		</div>
	</>)
}

export default TopicDisplay;