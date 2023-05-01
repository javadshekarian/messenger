var {Chat}=require('../model/db');
// var {encoding,decoding}=require('../encoding/security');

var online={}
var rOnline={}

module.exports={
    start: io=>{
        io.on('connection',socket=>{

            socket.on('online',data=>{
                online[data.username]=data.socketID;
                rOnline[data.socketID]=data.username;
            })
        
            socket.on('message',(data)=>{
                Chat.lastMessage(
                    data.message,
                    data.sender,
                    data.reciever
                )

                if(Boolean(online[data.reciever])){
                    io.to(online[data.reciever])
                    .emit('message',{
                        message:data.message,
                        sender:data.sender,
                        date:data.time
                    })
                }else{
                    Chat.plusOne(data.sender,data.reciever)
                }
            })

            socket.on('send-file',data=>{
                io.to(online[data.reciever]).emit('recieve-file',{
                    sender:data.sender,
                    reciever:data.reciever,
                    fileName:data.fileName,
                    fileRealName:data.fileRealName,
                    date:data.date
                })
            })

            /* is typing */
            socket.on('is-typing',data=>{
                if(online[data.reciever]){
                    io.to(online[data.reciever]).emit('is-typing',{
                        typer:data.sender
                    })
                }
            })

            socket.on('end-typing',data=>{
                if(online[data.reciever]){
                    io.to(online[data.reciever]).emit('end-typing',{
                        typer:data.sender
                    })
                }
            })
            /* end of is typing */

            /* video call */
            socket.on('call-user',data=>{
                io.to(online[data.contact]).emit('call-made',{
                    offer:data.offer,
                    sender:data.sender
                })
            })

            socket.on('reject-call',data=>{
                io.to(online[data.caller]).emit('rejected',{
                    rejecter:data.rejecter
                })
            })

            socket.on('make-answer',data=>{
                io.to(online[data.sender]).emit('answer-made',{
                    answer:data.answer,
                    contact:data.contact
                })
            })
            /* end of video call */

            socket.on('disconnect',()=>{
                delete online[rOnline[socket.id]]
            })
        })
    }
}