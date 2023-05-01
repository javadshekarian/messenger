var {Router}=require('express');
const {generate}=require("shortid");
const { connection } = require('../config/connection');

var {Chat}=require('../model/db');

const postRouts=new Router()

postRouts.post('/red',(req,res)=>{
    Chat.red(res,req.body.username);
})

postRouts.post('/register',(req,res)=>{
    var userInfo=req.body
    var profilePictureName=`${generate()}.jpg`;
    var file=req.files.file;
    
    file.mv(`./uploads/profilePicture/${profilePictureName}`,err=>{
        if(err) throw err;
    })

    Chat.user(
        userInfo.name,
        userInfo.family,
        userInfo.username,
        userInfo.phoneNumber,
        userInfo.password,
        profilePictureName
    )


    res.send(userInfo.username)
})

postRouts.post('/addContact',(req,res)=>{
    var contact=req.body

    Chat.addContact(
        res,
        contact.name,
        contact.family,
        contact.username,
        contact.phoneNumber,
        ""
    )
})

postRouts.post('/username',(req,res)=>{
    var username=req.body.username

    Chat.contacts(
        res,
        username
    )
})

postRouts.post('/specialContact',(req,res)=>{
    Chat.specialContact(
        res,
        req.body.contactName
    )
})

postRouts.post('/queryMessege',(req,res)=>{
    var info=req.body

    Chat.queryMessege(res,info.sender,info.reciever)
})

postRouts.post('/unreadMsgNumber',(req,res)=>{
    var info=req.body

    Chat.unreadMsgNumber(info.username,info.contactName,info.number)
})

postRouts.post('/unreadToZero',(req,res)=>{
    Chat.updateToZero(req.body.username,req.body.contactName)
})

postRouts.post('/saveMsg',(req,res)=>{
    var rb=req.body;
    Chat.savechat(
        rb.message,
        rb.sender,
        rb.reciever,
        rb.time,
        'txt'
    )
})

postRouts.post('/userInformation',(req,res)=>{
    var user=req.body.user;

    Chat.userInformation(res,user);
})

postRouts.post('/login',(req,res)=>{
    var username=req.body.username;
    var password=req.body.password;

    Chat.login(res,username,password)
})

postRouts.post('/saveMessage',(req,res)=>{
    var body=req.body;

    Chat.saveMessage(
        res,
        body.username,
        body.message,
        body.type,
        body.date
    )
})

postRouts.post('/querySaveMessage',(req,res)=>{
    var body=req.body;
    
    Chat.querySaveMessage(
        res,
        body.username
    );
})

postRouts.post('/addToContactByLink',(req,res)=>{
    var allLink=req.body.contactLink;
    var link=allLink.slice(6,allLink.length);

    Chat.addContact(
        res,
        "",
        "",
        req.body.username,
        "",
        link
    )
})

module.exports.postRouts=postRouts;