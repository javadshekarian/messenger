const group=new require('express').Router();
const {generate}=require('shortid');

const {Group}=require('../model/group');
const {Chat}=require('../model/db');
const {connection}=require('../config/connection');

group.post('/createGroup',(req,res)=>{
    var body=req.body;

    var groupID=generate();
    var selectedContacts=JSON.parse(body.groupMember);
    var groupName=body.groupName;
    var groupDescription=body.groupDescription;
    var username=body.username
    var accountInformation=JSON.parse(body.accountInformation);

    var groupPicture=req.files.groupPicture;
    var groupPictureName=generate();

    var tmpName=groupPicture.name.split('.').reverse()[0];
    var fullName=`${groupPictureName}.${tmpName}`;

    groupPicture.mv(`./uploads/groupPicture/${fullName}`,err=>{
        if(err) throw err;

        new Promise(resolve=>{
            Group.createGroup(username,groupName,groupDescription,groupID,fullName,resolve)
        }).then(()=>{
            Group.addMember(accountInformation[0],accountInformation[1],groupID,groupName);
            selectedContacts.forEach(contact => {
                Group.addMember(contact.username,contact.phoneNumber,groupID,groupName);
            });
            var myAccountObj=new Object();
            myAccountObj.username=accountInformation[0];
            myAccountObj.phoneNumber=accountInformation[1];

            selectedContacts.push(myAccountObj);

            var AllInfo=new Object();
            AllInfo.selectedContacts=selectedContacts;

            var group=new Object();
            group.admin=username;
            group.groupID=groupID;
            group.groupName=groupName;
            group.groupDescription=groupDescription;
            group.groupPicture=fullName;
            group.pined=0;
            group.lastMessage="New Group";
            group.unreadMsgNumber=0;

            AllInfo.group=group;
            res.json(AllInfo)
        })
    })
})

group.post('/newGroup',(req,res)=>{
    var groupID=req.body.groupID;
    
    Group.newGroup(
        res,
        groupID
    )
})

group.post('/groupInformation',(req,res)=>{
    var body=req.body;

    Group.groupInformation(res,body.groupID);
})

group.post('/saveGroupMsg',(req,res)=>{
    var body=req.body;

    Group.saveMessage(
        body.groupID,
        body.date,
        body.message,
        body.username,
        body.type
    )
})

group.post('/groupMessage',(req,res)=>{
    var body=req.body;

    Group.queryGroupMessage(res,body.groupID);
})

group.post('/unreadToZeroGroup',(req,res)=>{
    var body=req.body;

    Group.updateToZero(
        body.username,
        body.groupID
    )
})

group.post('/joinGroup',(req,res)=>{
    var body=req.body;
    var link=body.link.slice(12,body.link.length);
    var username=body.username

    Group.seeGroup(res,link,username)
})

group.post('/joinToGroup',(req,res)=>{
    var body=req.body
    
    Group.joinByBTN(
        body.username,
        body.phoneNumber,
        body.groupName,
        body.groupID
    )
})

group.post('/leftFromGroup',(req,res)=>{
    var body=req.body;

    Group.leftGroup(body.username,body.groupID);
})

group.post('/isJoin',(req,res)=>{
    var body=req.body;

    Group.seeGroup(res,body.groupID,body.username)
})

module.exports.group=group;