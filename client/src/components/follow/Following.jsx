import React from "react";

const Following = ({data=[]})=>{
    data=[
        {
            avatar:"https://miro.medium.com/v2/resize:fill:25:25/1*QqB7GMb2rAmYbVYwRuEZlg.jpeg",
            username:"Entrepreneurship Entrepreneurship Entrepreneurship"
        },
        {
            avatar:"https://miro.medium.com/v2/resize:fill:25:25/1*QqB7GMb2rAmYbVYwRuEZlg.jpeg",
            username:"Easdsadsadshi"
        },
        {
            avatar:"https://miro.medium.com/v2/resize:fill:25:25/1*QqB7GMb2rAmYbVYwRuEZlg.jpeg",
            username:"Entrepreneurship Entrepreneurship Entrepreneurship"
        },
        {
            avatar:"https://miro.medium.com/v2/resize:fill:25:25/1*QqB7GMb2rAmYbVYwRuEZlg.jpeg",
            username:"HardikMitta"
        },
        {
            avatar:"https://miro.medium.com/v2/resize:fill:25:25/1*QqB7GMb2rAmYbVYwRuEZlg.jpeg",
            username:"Entrepreneurship Entrepreneurship Entrepreneurship"
        }
    ]

    if (data?.length === 0) return null;
    return(<>
        <div className="w-full">
            <h2 className=" font-bold text-lg text-black my-3">Following</h2>
            <div className="w-full max-h-[200px] overflow-hidden">
                {data.map((val,idx)=>(
                <div key={idx} className=" flex justify-between content-center py-2 ">
                    <div className="flex max-w-[90%]">
                        <div className="w-6 h-6 rounded-1/2 overflow-hidden ">
                            <img className="w-full h-full object-cover" src={val.avatar} alt="" />
                        </div>
                        <div className="max-w-[80%] ">
                            <p className="py-1 text-[12px] ml-2 overflow-hidden overflow-ellipsis whitespace-nowrap">{val.username}</p>
                        </div>
                    </div>
                    <button className="">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.6-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z" fill="currentColor"></path></svg>
                    </button>
                </div>
                ))}

            </div>
            <div className="py-2 my-3">
                <button>See all <span>(723)</span></button>
            </div>
        </div>
    </>)
}

export default Following;