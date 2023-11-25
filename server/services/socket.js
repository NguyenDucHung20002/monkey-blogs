const {Server} =  require("socket.io")
const Notify = require("../models/Notify")
const User = require("../models/User");
const Article = require("../models/Article");
const addUrlToImg = require("../utils/addUrlToImg");
const io= new Server({
  cors:{
    origin:"http://localhost:5173",
  }
})
const PORT = 5000;
let onlineUSer = []



const addNewNotif = async (socket,event,senderName, receiverName, type, slug) => {
  try {
    if(!senderName || !receiverName || !type || !slug){
      return socket.emit(event, { error: "missing field" });
    }
    const [userReceiver, userSender,article] = await Promise.all([
      User.findOne({ username: receiverName }),
      User.findOne({ username: senderName }),
      Article.findOne({slug}).select("_id title slug")
    ]);
    //likeArt, likeCmt,Follow,newPost...
    const validType = ["likeArt", "cmt"]
    if (!userReceiver || !userSender) {
      return socket.emit(event, { error: "Người dùng không tồn tại" });
    }
    if(userSender?.username === userReceiver?.username){
      return socket.emit(event, { error: "thông thể gửi thông báo cho bản thân" });
    }
    if(!article){
      return socket.emit(event, { error: "bài viết không tồn tại" });
    }
    if(!validType.includes(type)){
      return socket.emit(event, { error: "type not matched" });
    }
    const exist = await Notify.findOne({type, slugArticle:slug, sender:userSender?._id})
    if(exist && type==="likeArt"){
      return socket.emit(event, { error: "user đã thực hiện hành động này" });
    }
    let newNotif = new Notify({
      sender:userSender,
      receiver:userReceiver,
      avatarSender:userSender.avatar,
      type,
      slugArticle:slug,
      content:''
    })
    if(type === "likeArt"){
      newNotif.content = `${userSender.fullname} đã thích bài viết của bạn: ${article.title}`
    }
    if(type === "cmt"){
      newNotif.content = `${userSender.fullname} đã bình luận bài viết của bạn: ${article.title}`
    }
    await newNotif.save()
    return socket.emit(event, { message: "tao thanh cong" });
  } catch (error) {
    return socket.emit(event, { error });
  }
};

const getNotif = async(userId)=>{
  const noti = await Notify.find({receiver:userId})
  if(!noti) return null
  noti.forEach((val)=>{
    val.avatarSender=addUrlToImg(val.avatarSender)
  }) 
  return noti.reverse()
}

const addNewUser = async(userName, socketId)=>{
  try {
    const user = await User.findOne({ username:userName })
    !onlineUSer.some((user)=>user.userName === userName) && onlineUSer.push({userName,userId: user?._id,socketId});
    // !onlineUSer.some((user)=>user.userName === userName) && onlineUSer.push({userName,socketId});
    
  } catch (error) {
    console.log(error);
  }
};
const removeUser = (socketId)=>{
  onlineUSer = onlineUSer.filter((user)=>user.socketId !=socketId)
}
const getOnlineUser = (userName)=>{
  return onlineUSer.find((user)=>user.userName ===userName)
} 

io.on("connection",(socket)=>{
  socket.on("newUser",async({userName})=>{
    await addNewUser(userName,socket.id);
    // console.log(onlineUSer);
  })

  socket.on("sendNotification", async({ senderName, receiverName, type, slug }) => {
    try {
      await addNewNotif(socket,"error",senderName,receiverName,type,slug)
      const receiver = getOnlineUser(receiverName);
      if(!receiver) return
      const notification = await getNotif(receiver.userId)
      io.to(receiver.socketId).emit("error", notification); 
    } catch (error) {
      console.log("err=>>",error);
      socket.emit("error",{error})
    }
  });
  socket.on("disconnect",()=>{
    removeUser(socket.id)
  })
})

io.listen(PORT,()=>{
  console.log("socket is running! port:",PORT);
})