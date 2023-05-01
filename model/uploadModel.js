const uuid=require('uuid').v4;
const {generate}=require("shortid");

const {connection}=require("../config/connection");

module.exports.Upload=class Upload{
    static uploadFile(sender,reciever,date,fileID,type,fileName){
        var sql0=`insert into files
        (sender,reciever,date,fileID,type,fileName)
        VALUES ("${sender}","${reciever}","${date}","${fileID}","${type}","${fileName}")`;

        var sql1=`insert into messegesPrivet
        (messege,sender,reciever,date,type,messegeID)
        VALUES ("${fileName}","${sender}","${reciever}","${date}","${type}","${fileID}")`

        connection.query(sql0,(err,result)=>{
            if(err) throw err;
            
            connection.query(sql1,(err,result)=>{
                if(err) throw err;
            })
        })
    }

    static uploadFileGroup(sender,groupID,date,fileID,type,fileName){
        var sql0=`insert into files
        (sender,reciever,date,fileID,type,fileName)
        VALUES ("${sender}","${groupID}","${date}","${fileID}","${type}","${fileName}")`;

        var sql1=`insert into groupMessage
        (message,username,groupID,date,type,messageID)
        VALUES ("${fileName}","${sender}","${groupID}","${date}","${type}","${fileID}")`

        connection.query(sql0,(err,result)=>{
            if(err) throw err;
            
            connection.query(sql1,(err,result)=>{
                if(err) throw err;
            })
        })
    }

    static uploadFileChannel(sender,channelID,date,fileID,type,fileName){
        var sql0=`insert into files
        (sender,reciever,date,fileID,type,fileName)
        VALUES ("${sender}","${channelID}","${date}","${fileID}","${type}","${fileName}")`;

        var sql1=`insert into channelMessage
        (message,username,channelID,date,type,messageID)
        VALUES ("${fileName}","${sender}","${channelID}","${date}","${type}","${fileID}")`

        connection.query(sql0,(err,result)=>{
            if(err) throw err;
            
            connection.query(sql1,(err,result)=>{
                if(err) throw err;
            })
        })
    }
}