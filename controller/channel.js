const channel=new require('express').Router();
const {generate}=require('shortid');

const {Channel}=require('../model/channel');
const {Chat}=require('../model/db');
const {connection}=require('../config/connection');

channel.post('/createChannel',(req,res)=>{
    var body=req.body;

    var channelID=generate();
    var selectedContacts=JSON.parse(body.channelMember);
    var channelName=body.channelName;
    var channelDescription=body.channelDescription;
    var username=body.username
    var accountInformation=JSON.parse(body.accountInformation);

    var channelPicture=req.files.channelPicture;
    var channelPictureName=generate();

    var tmpName=channelPicture.name.split('.').reverse()[0];
    var fullName=`${channelPictureName}.${tmpName}`;

    channelPicture.mv(`./uploads/channelPicture/${fullName}`,err=>{
        if(err) throw err;

        new Promise(resolve=>{
            Channel.createChannel(username,channelName,channelDescription,channelID,fullName,resolve)
        }).then(()=>{
            Channel.addMember(accountInformation[0],accountInformation[1],channelID,channelName);
            selectedContacts.forEach(contact => {
                Channel.addMember(contact.username,contact.phoneNumber,channelID,channelName);
            });
            var myAccountObj=new Object();
            myAccountObj.username=accountInformation[0];
            myAccountObj.phoneNumber=accountInformation[1];

            selectedContacts.push(myAccountObj);

            var AllInfo=new Object();
            AllInfo.selectedContacts=selectedContacts;

            var channel=new Object();
            channel.admin=username;
            channel.channelID=channelID;
            channel.channelName=channelName;
            channel.channelDescription=channelDescription;
            channel.channelPicture=fullName;
            channel.pined=0;
            channel.lastMessage="New Channel";
            channel.unreadMsgNumber=0;

            AllInfo.channel=channel;
            res.json(AllInfo)
        })
    })
})

channel.post('/load',(req,res)=>{
    var body=req.body;
    var username=body.username;
    var load=new Object();

    var sql=`select contacts.contactName,contacts.notification,contacts.contactPhone,contacts.pined,contacts.unreadMsgNumber,contacts.lastMessage,users.profilePicAddress
    from contacts,users where contacts.username="${username}" and contacts.contactName=users.username;`

    connection.query(sql,(err,result)=>{
        load.contacts=result;
        var sql=`select channelMember.channelName,channelMember.notification,channelMember.channelID,
        channelMember.pined,channelMember.unreadMsgNumber,channelMember.lastMessage,
        channel.channelPicture,channel.admin from channelMember,channel
        where channelMember.username="${username}" and channelMember.channelID=channel.channelID`;
        connection.query(sql,(err,result)=>{
            load.channels=result;
            var sql=`select groupMember.groupName,groupMember.notification,groupMember.groupID,
            groupMember.pined,groupMember.unreadMsgNumber,groupMember.lastMessage,
            groups.groupPicture,groups.admin from groupMember,groups
            where groupMember.username="${username}" and groupMember.groupID=groups.groupID`;
            connection.query(sql,(err,result)=>{
                load.groups=result;
                res.json(load);
            })
        })
    })
})

channel.post('/channelInformation',(req,res)=>{
    var body=req.body;

    Channel.channelInformation(res,body.channelID);
})

channel.post('/saveChannelMsg',(req,res)=>{
    var body=req.body;

    Channel.saveMessage(
        body.channelID,
        body.date,
        body.message,
        body.username,
        body.type
    )
})

channel.post('/channelMessage',(req,res)=>{
    var body=req.body;

    Channel.queryChannelMessage(res,body.channelID);
})

channel.post('/unreadToZeroChannel',(req,res)=>{
    var body=req.body;

    Channel.updateToZero(
        body.username,
        body.channelID
    )
})

channel.post('/newChannel',(req,res)=>{
    var channelID=req.body.channelID;
    
    Channel.newChannel(
        res,
        channelID
    )
})

channel.post('/joinChannel',(req,res)=>{
    var body=req.body;
    var link=body.link.slice(14,body.link.length);
    var username=body.username

    Channel.seeChannel(res,link,username)
})

channel.post('/joinToChannel',(req,res)=>{
    var body=req.body
    
    Channel.joinByBTN(
        body.username,
        body.phoneNumber,
        body.channelName,
        body.channelID
    )
})

channel.post('/leftFromChannel',(req,res)=>{
    var body=req.body;

    Channel.leftChannel(body.username,body.channelID);
})

channel.post('/isJoinChannel',(req,res)=>{
    var body=req.body;

    Channel.seeChannel(res,body.channelID,body.username)
})

module.exports.channel=channel;