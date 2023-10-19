import React from "react";

const TopicDisplay =({slug='Explore-topics'})=>{

	return(<>
		<div className="w-full h-[200px] my-12 text-center border-b border-l-stone-300">
			{slug=='Explore-topics'? 
			(
				<div className="">
					<h2 className="text-4xl font-bold ">Explore topics</h2>
					<div className="my-6">
						<div className="flex items-center justify-start py-2 w-11/12 md:w-5/6 lg:w-2/4 md:py-5 px-3 bg-[#F9F9F9] mx-auto rounded-full">
							<div className="ml-1 md:ml-4 mx-2">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z" fill="currentColor"></path></svg>
							</div>
							<input className="bg-transparent text-sm w-full" type="text" placeholder="Seach all topics"/>
						</div>
					</div>
				</div>
			)
			:
			(
				<div className="">
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
			)}
		</div>
	</>)
}

export default TopicDisplay;