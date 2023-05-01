const {Group}=require('../model/group');
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
                Group.updateLastMessage(data.groupID,data.message+' ...');
                Group.joinByMessage(data.username,data.groupID,data.groupName,data.phoneNumber);
                
                io.to(data.groupID).emit('message',{
                    groupID:data.groupID,
                    date:data.date,
                    message:data.message,
                    username:data.username
                })
            })

            socket.on('seen-message',(data)=>{
                Group.addOne(data.groupID);
                Group.updateToZero(
                    data.username,
                    data.groupID
                )
            })

            socket.on('create-group',data=>{
                data.groupMember.forEach(member => {
                    if(online[member.username]){
                        sockets[member.username].join(data.groupID)
                    }
                });
            })

            socket.on('send-file',data=>{
                io.to(data.groupID).emit('recieve-file',{
                    groupID:data.groupID,
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