const uuid=require('uuid').v4;
const {Router}=require('express');

const {Upload}=require('../model/uploadModel');

const uploadRouter=new Router()

uploadRouter.post('/sendFile',(req,res)=>{
    var file=req.files.sendFile;
    var fileType=file.name.split('.').reverse()[0];
    var reqBody=req.body;
    var fileName=uuid()
    file.mv(`./uploads/files/${fileName}.${fileType}`,err=>{
        if(err) throw err;
        
        Upload.uploadFile(
            reqBody.sender,
            reqBody.reciever,
            reqBody.date,
            fileName,
            reqBody.type,
            reqBody.fileName
        )
        res.send(`${fileName}.${fileType}`)
    })
})

uploadRouter.post('/sendFileGroup',(req,res)=>{
    var file=req.files.sendFile;
    var fileType=file.name.split('.').reverse()[0];
    var reqBody=req.body;
    var fileName=uuid()
    file.mv(`./uploads/files/${fileName}.${fileType}`,err=>{
        if(err) throw err;
        
        Upload.uploadFileGroup(
            reqBody.sender,
            reqBody.groupID,
            reqBody.date,
            fileName,
            reqBody.type,
            reqBody.fileName
        )
        res.send(`${fileName}.${fileType}`)
    })
})

uploadRouter.post('/sendFileChannel',(req,res)=>{
    var file=req.files.sendFile;
    var fileType=file.name.split('.').reverse()[0];
    var reqBody=req.body;
    var fileName=uuid()
    file.mv(`./uploads/files/${fileName}.${fileType}`,err=>{
        if(err) throw err;
        
        Upload.uploadFileChannel(
            reqBody.sender,
            reqBody.channelID,
            reqBody.date,
            fileName,
            reqBody.type,
            reqBody.fileName
        )
        res.send(`${fileName}.${fileType}`)
    })
})

module.exports.uploadRouter=uploadRouter;