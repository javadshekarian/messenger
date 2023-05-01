const socket=io();
const channelNamespace=io("/channel");
const groupNamespace=io("/group");

var username=document.cookie.split("=")[1];

var contactActive=false;
var channelActive=false;
var groupActive=false;


var messageType=null;

var nowChannel=new Object();
var nowGroup=new Object();

var mainInputContent=document.getElementById('mainInputContent');

var myContacts=new Object();
var channels=new Object();
var groups=new Object();

var notificationObject=new Object();

var contactID=0;
var nowChannelID=0;
var nowGroupID=0;

var joinOrLeft=document.getElementById('joinOrLeft');

$(document).ready(()=>{
    if(document.body.scrollWidth<768){
        newMessage.classList.add('dsn');
        document.querySelector('.right-col').classList.add('dsn');
        document.querySelector('.chat-section').classList.add('dsn');
        document.querySelector('.profile-section').classList.add('dsn');
    }
    var formdata=new FormData()
    formdata.append('username',username)

    var req=new XMLHttpRequest()
    req.onloadend=e=>{
        var load=JSON.parse(e.target.responseText);

        /* create contacts */
        load.contacts.forEach(contact => {
            myContacts[contact.contactName]=contactID;
            notificationObject[contact.contactName]=contact.notification;

            var chatBox=createContact('contact',contact)
            chatBox.addEventListener('click',()=>{
                joinOrLeft.classList.add('dsn');

                contactActive=true;
                channelActive=false;
                groupActive=false;
                messageType='privateMessage';
                var user={
                    contactName:      contact.contactName,
                    contactPhone:     contact.contactPhone,
                    pined:            contact.pined,
                    unreadMsgNumber:  contact.unreadMsgNumber,
                    lastMessage:      contact.lastMessage
                }
                sendMessege(username,user.contactName,chatBox);
            });
            var contactContai=document.getElementById('contactContai');
            contactContai.appendChild(chatBox)

            ++contactID;
        });
        /* end of create contacts */

        /* create channels */
        load.channels.forEach(channel=>{
            channels[channel.channelID]=nowChannelID;
            notificationObject[channel.channelID]=channel.notification;

            var channelBox=createContact('channel',channel);
            channelBox.addEventListener('click',()=>{
                joinOrLeft.classList.remove('dsn');

                channelActive=true;
                contactActive=false;
                groupActive=false;

                messageType='channelMessage';
                var channelInformation=channel;
                nowChannel=channel;

                isJoinChannel(username,nowChannel.channelID)
                .then(number=>{
                    if(number===2){
                        joinOrLeft.innerHTML='left';
                    }else{
                        joinOrLeft.innerHTML='join';
                    }
                })

                setChannelInformation(channelInformation.channelID);
                resetChannel(channelBox,channel.channelID,username);
            });
            var contactContai=document.getElementById('contactContai');
            contactContai.appendChild(channelBox);

            ++nowChannelID;
        })
        /* end of create channels */

        /* create group */
        load.groups.forEach(group=>{
            groups[group.groupID]=nowGroupID;
            notificationObject[group.groupID]=group.notification;

            var groupBox=createContact('group',group);
            groupBox.addEventListener('click',()=>{
                joinOrLeft.classList.remove('dsn');

                channelActive=false;
                contactActive=false;
                groupActive=true;

                messageType='groupMessage';
                var groupInformation=group;
                nowGroup=group;

                isJoin(username,nowGroup.groupID)
                .then(number=>{
                    if(number===2){
                        joinOrLeft.innerHTML='left';
                    }else{
                        joinOrLeft.innerHTML='join';
                    }
                })

                setGroupInformation(groupInformation.groupID);
                resetGroup(groupBox,group.groupID,username)
            });
            var contactContai=document.getElementById('contactContai');
            contactContai.appendChild(groupBox);

            ++nowGroupID;
        })
        /* end of create group */
    }
    req.open('post','/load')
    req.send(formdata)
})

socket.on('welcome',data=>{
    socket.emit('builded',{
        socketID:data.socketID,
        username
    })
})

var form=document.getElementById('sendMessageform');
var messegeInput=form.querySelector('.input-massage');
var chatBox=document.querySelector('.chat-box');
var rightCol=document.querySelectorAll('.right-col');
var newMessage=document.querySelector('.newMessage');
var isTyping=document.getElementById('istyping');

var recieverInfo=new Object()

form.addEventListener('submit',e=>{
    e.preventDefault()
    var message=messegeInput.value

    switch(messageType){
        case 'privateMessage':
            send(message,date())
            socket.emit('message',{
                message,
                sender:username,
                reciever:recieverInfo.name,
                time:date()
            })
        
            var formdata=new FormData();
            formdata.append('message',message);
            formdata.append('sender',username);
            formdata.append('reciever',recieverInfo.name);
            formdata.append('time',date());
        
            var req=new XMLHttpRequest();
            req.open('post','/saveMsg');
            req.send(formdata)
            break;
        case 'channelMessage':
            send(message,date())
            var formdata=new FormData();
            formdata.append('message',message);
            formdata.append('username',username);
            formdata.append('channelID',nowChannel.channelID);
            formdata.append('date',date());
            formdata.append('type','txt');
        
            var req=new XMLHttpRequest();
            req.open('post','/saveChannelMsg');
            req.send(formdata);
            channelNamespace.emit('message',{
                channelID:nowChannel.channelID,
                date:date(),
                message:message,
                username:username
            })
            break;
        case 'groupMessage':
            send(message,date())
            var formdata=new FormData();
            formdata.append('message',message);
            formdata.append('username',username);
            formdata.append('groupID',nowGroup.groupID);
            formdata.append('date',date());
            formdata.append('type','txt');
        
            var req=new XMLHttpRequest();
            req.open('post','/saveGroupMsg');
            req.send(formdata)

            groupNamespace.emit('message',{
                groupID:nowGroup.groupID,
                date:date(),
                message:message,
                username:username,
                phoneNumber:myAccountInformation.phoneNumber,
                groupName:nowGroup.groupName
            })
            break;
    }

    messegeInput.value=""

    // var water=new Audio();
    // water.src="music/water.mp3";
    // water.volume=0.2;
    // water.play();
})

messegeInput.addEventListener('keyup',()=>{
    if(messageType==='privateMessage'){
        if(messegeInput.value!==""){
            socket.emit('is-typing',{
                sender:username,
                reciever:recieverInfo.name
            })
        }else{
            socket.emit('end-typing',{
                sender:username,
                reciever:recieverInfo.name
            })
        }
    }
})

socket.on('end-typing',data=>{
    if(messageType==='privateMessage'){
        if(recieverInfo.name===data.typer){
            isTyping.classList.add('dsn');
        }
    }
})

socket.on('is-typing',data=>{
    if(messageType==='privateMessage'){
        if(recieverInfo.name===data.typer){
            isTyping.classList.remove('dsn');
            isTyping.innerHTML=`${data.typer} is typing ...`;
        }
    }
})

socket.on('message',data=>{
    if(Number(notificationObject[data.sender])){
        messageMusic();
    }
    isTyping.classList.add('dsn');
    if(myContacts[data.sender]===undefined){
        var formdata=new FormData();
        formdata.append('username',username);
        formdata.append('contactName',data.sender);
        var http=new XMLHttpRequest();
        http.onloadend=e=>{
            var addContact=JSON.parse(e.target.responseText);
            myContacts[addContact.contactName]=Object.keys(myContacts).length;
            notificationObject[addContact.contactName]=1;

            var chatBox=createContact('contact',addContact);
            chatBox.addEventListener('click',()=>{
                joinOrLeft.classList.add('dsn');

                contactActive=true;
                channelActive=false;
                groupActive=false;
                messageType='privateMessage';
                var user={
                    contactName:      addContact.contactName,
                    contactPhone:     addContact.contactPhone,
                    pined:            addContact.pined,
                    unreadMsgNumber:  addContact.unreadMsgNumber,
                    lastMessage:      addContact.lastMessage
                }
                sendMessege(username,user.contactName,chatBox);
            });
            var contactContai=document.getElementById('contactContai');
            contactContai.appendChild(chatBox)
        }
        http.open('post','/specialContact');
        http.send(formdata);
    }
    // var sms=new Audio();
    // sms.src='music/sms.mp3';
    // sms.play();
    if(contactActive){
        switch(recieverInfo.name){
            case data.sender:
                var x=Number(myContacts[`${data.sender}`])
                recieve(data.message,data.date)
                sliceMsg(messageType,data.message,x)
                break;
            case undefined:
                var x=Number(myContacts[`${data.sender}`]);
                changeMsgNumberAndLastChat(messageType,x,data.message);
                updateMsgNumber(username,data.sender,x)
                break;
            default:
                var x=Number(myContacts[`${data.sender}`]);
                changeMsgNumberAndLastChat(messageType,x,data.message);
                updateMsgNumber(username,data.sender,x)
                break;
        }
    }
})

var arrowLeft=document.getElementById('goBack');

sendMessege=(username,contactName,contactContent)=>{
    generalSetting()

    userInformation(contactName);
    resetContact(contactContent);
    recieverInfo.name=contactName;
    recieverInfo.sender=username;

    var formdata=new FormData()
    formdata.append('sender',username.toLowerCase());
    formdata.append('reciever',contactName.toLowerCase())

    var req=new XMLHttpRequest();
    req.onloadend=e=>{
        var dbmesseges=JSON.parse(e.target.responseText);
        createMessageIndexFuncForContact(dbmesseges);
        scrollTo()
    }
    req.open('post','/queryMessege');
    req.send(formdata)
}

setChannelInformation=(channelID)=>{
    generalSetting();

    channelInformation(channelID);

    var formdata=new FormData();
    formdata.append('channelID',channelID);

    var http=new XMLHttpRequest();
    http.onloadend=e=>{
        var dbmesseges=JSON.parse(e.target.responseText);
        createMessageIndexFunc(dbmesseges);
        scrollTo()
    }
    http.open('post','/channelMessage')
    http.send(formdata);
}

createMessageIndexFunc=(array)=>{
    new Promise(resolve0=>{
        var index=array[0];
        var type=index.type;
        if(type!=='txt'){
            if(index.username===username){
                new Promise(async(resolve)=>{
                    await sendFileFunction(
                        index.type,
                        `${index.messageID}.${index.type}`,
                        index.message,
                        index.date
                    )
                    resolve();
                }).then(()=>{
                    array.shift();
                    resolve0(array);
                })
            }else{
                new Promise(async(resolve)=>{
                    await reciveFile(
                        index.type,
                        `${index.messageID}.${index.type}`,
                        index.message,
                        index.date
                    )
                    resolve();
                }).then(()=>{
                    array.shift();
                    resolve0(array);
                })
            }
        }else{
            if(index.username===username){
                new Promise(async(resolve)=>{
                    await send(index.message,index.date)
                    resolve()
                }).then(()=>{
                    array.shift();
                    resolve0(array);
                })
            }else{
                new Promise(async(resolve)=>{
                    await recieve(index.message,index.date)
                    resolve()
                }).then(()=>{
                    array.shift();
                    resolve0(array);
                })
            }
        }
    }).then((array)=>{
        if(0<array.length){
            createMessageIndexFunc(array)
        }
    })
}
createMessageIndexFuncForContact=(array)=>{
    new Promise(resolve0=>{
        var index=array[0];
        var type=index.type;
        if(type!=='txt'){
            if(index.sender===username){
                new Promise(async(resolve)=>{
                    await sendFileFunction(
                        index.type,
                        `${index.messegeID}.${index.type}`,
                        index.messege,
                        index.date
                    )
                    resolve();
                }).then(()=>{
                    array.shift();
                    resolve0(array);
                })
            }else{
                new Promise(async(resolve)=>{
                    await reciveFile(
                        index.type,
                        `${index.messegeID}.${index.type}`,
                        index.messege,
                        index.date
                    )
                    resolve();
                }).then(()=>{
                    array.shift();
                    resolve0(array);
                })
            }
        }else{
            if(index.sender===username){
                new Promise(async(resolve)=>{
                    await send(index.messege,index.date)
                    resolve()
                }).then(()=>{
                    array.shift();
                    resolve0(array);
                })
            }else{
                new Promise(async(resolve)=>{
                    await recieve(index.messege,index.date)
                    resolve()
                }).then(()=>{
                    array.shift();
                    resolve0(array);
                })
            }
        }
    }).then((array)=>{
        if(0<array.length){
            createMessageIndexFuncForContact(array)
        }
    })
}

setGroupInformation=(groupID)=>{
    generalSetting();

    groupInformation(groupID);

    var formdata=new FormData();
    formdata.append('groupID',groupID);

    var http=new XMLHttpRequest();
    var array=new Array();
    http.onloadend=e=>{
        var dbmesseges=JSON.parse(e.target.responseText);
        createMessageIndexFunc(dbmesseges);
        scrollTo()
    }
    http.open('post','/groupMessage')
    http.send(formdata);
}

itemFunction=(item)=>{
    return item;
}

socket.on('connect',()=>{
    socket.emit('online',{
        socketID:socket.id,
        username
    })
})

socket.on("disconnect", () => {
    socket.emit('dis',{})
});



const menu=document.getElementById('menu');
const menuContent=document.querySelector('.menuContent')

resetMenu=()=>{
    menuContent.classList.remove('w20vw');
    menuContent.classList.remove('w30vw');
    menuContent.classList.remove('w70vw');
}

menu.addEventListener('click',()=>{
    if(768<=document.body.scrollWidth&&document.body.scrollWidth<=1024){
        if(menuContent.classList.contains('w30vw')){
            resetMenu()
        }else{
            menuContent.classList.add('w30vw');
        }
    }
    if(1024<document.body.scrollWidth){
        if(menuContent.classList.contains('w20vw')){
            resetMenu()
        }else{
            menuContent.classList.add('w20vw');
        }
    }
    if(document.body.scrollWidth<768){
        if(menuContent.classList.contains('w70vw')){
            resetMenu()
        }else{
            menuContent.classList.add('w70vw');
        }
    }
})

socket.on('recieve-file',data=>{
    const fileName=data.fileRealName;
    const fileTemp=fileName.split('.').reverse()[0];

    reciveFile(fileTemp,data.fileName,data.fileRealName,date())
})

arrowLeft.addEventListener('click',()=>{
    arrowLeft.classList.add('dsn');
    document.querySelector('.left-col').classList.remove('dsn');
    document.querySelector('.right-col').classList.add('dsn');
    menuContent.classList.remove('dsn');
    var rc=menuContent.classList.value.split(' ')[1];
    menuContent.classList.remove(rc);
})

var cll=document.querySelector('.cll')

cll.addEventListener('click',()=>{
    if(document.body.scrollWidth<768){
        document.querySelector('.profile-section').classList.remove('dsn');
        document.querySelector('.chat-section').classList.add('dsn');
    }
})

var chatB=document.querySelector('.chatB');
var profileSection=document.querySelector('.profile-section')
chatB.addEventListener('click',()=>{
    if(document.body.scrollWidth<768){
        document.querySelector('.profile-section').classList.add('dsn');
        document.querySelector('.chat-section').classList.remove('dsn');
    }
})