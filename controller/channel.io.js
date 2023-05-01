const {Channel}=require('../model/channel');
const {connection}=require('../config/connection');

var online={}
var rOnline={}
var sockets = new Object();

module.exports={
    start: io=>{
        io.on('connection',socket=>{
            sockets[socket.handshake.headers.cookie.split('=')[1]]=socket;

            socket.on('online',data=>{
                online[data.username]=data.socketID;
                rOnline[data.socketID]=data.username;
            })

            socket.on('message',(data)=>{
                Channel.updateLastMessage(data.channelID,data.message);
                io.to(data.channelID).emit('message',{
                    channelID:data.channelID,
                    date:data.date,
                    message:data.message,
                    username:data.username
                })
            })

            socket.on('seen-message',(data)=>{
                Channel.addOne(data.channelID);
                Channel.updateToZero(
                    data.username,
                    data.channelID
                )
            })

            socket.on('create-channel',data=>{
                data.channelMember.forEach(member => {
                    if(online[member.username]){
                        sockets[member.username].join(data.channelID)
                    }
                });
            })

            socket.on('send-file',data=>{
                io.to(data.channelID).emit('recieve-file',{
                    channelID:data.channelID,
                    sender:data.sender,
                    fileName:data.fileName,
                    date:data.date,
                    fileRealName:data.fileRealName
                })
            })

            socket.on('disconnect',()=>{
                delete online[rOnline[socket.id]]
            })
        })
    }
}