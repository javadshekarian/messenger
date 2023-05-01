var chatBox=document.querySelector('.chat-box');
var contactContai=document.getElementById('contactContai');
var optionContainer=document.getElementById('optionContainer');
var bio=document.getElementById('bio');

addToContactByLink=(message)=>{
    var formdata=new FormData();
    formdata.append('username',username);
    formdata.append('contactLink',message);

    var http=new XMLHttpRequest();
    http.onloadend=e=>{
        var res=Number(e.target.responseText);
        if((res!==0)&&(res!==2)){
            new Promise(resolve=>{
                var addContact=JSON.parse(e.target.responseText)[0];
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
                    };
                    sendMessege(username,user.contactName,chatBox);
                });

                var contactContai=document.getElementById('contactContai');
                contactContai.appendChild(chatBox);

                resolve(chatBox);
            }).then(chatBox=>{
                chatBox.click();
            })
        }
        if(res===2){
            var newLink=message.slice(6,message.length)
            document.querySelectorAll('.messagePrivateElement')[myContacts[newLink]].click();
        }
    }
    http.open('post','/addToContactByLink');
    http.send(formdata);
}

seeGroup=(message)=>{
    var formdata=new FormData();
    formdata.append('username',myAccountInformation.username);
    formdata.append('link',message);

    var http=new XMLHttpRequest();
    http.onloadend=e=>{
        var response=Number(JSON.parse(e.target.responseText));
        switch(response){
            case 0:
                /* group not exist */
                console.log('the group not exist!');
                break;
            case 1:
                if(groups[message.slice(12,message.length)]==undefined){
                    var formdata=new FormData();
                    formdata.append('groupID',message.slice(12,message.length));
                    var http=new XMLHttpRequest();
                    http.onloadend=e=>{
                        var group=JSON.parse(e.target.responseText);
                        groups[group.groupID]=Object.keys(groups).length;
                        notificationObject[group.groupID]=1;

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

                        groupBox.click();
                    }
                    http.open('post','/newGroup');
                    http.send(formdata);
                }else{
                    document.querySelectorAll('.groupElement')[groups[message.slice(12,message.length)]].click();
                }
                break;
            case 2:
                /* user has the group */
                document.querySelectorAll('.groupElement')[groups[message.slice(12,message.length)]].click();
                break
        }
    }
    http.open('post','/joinGroup');
    http.send(formdata)
}

seeChannel=(message)=>{
    var formdata=new FormData();
    formdata.append('username',myAccountInformation.username);
    formdata.append('link',message);

    var http=new XMLHttpRequest();
    http.onloadend=e=>{
        var response=Number(JSON.parse(e.target.responseText));
        switch(response){
            case 0:
                /* channel not exist */
                console.log('the channel not exist!');
                break;
            case 1:
                if(channels[message.slice(14,message.length)]===undefined){
                    var formdata=new FormData();
                    formdata.append('channelID',message.slice(14,message.length));
                    var http=new XMLHttpRequest();
                    http.onloadend=e=>{
                        var channel=JSON.parse(e.target.responseText);
                        channels[channel.channelID]=Object.keys(channels).length;
                        notificationObject[channel.channelID]=1;

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
                            resetChannel(channelBox,channel.channelID,username)
                        });
                        var contactContai=document.getElementById('contactContai');
                        contactContai.appendChild(channelBox);

                        channelBox.click();
                    }
                    http.open('post','/newChannel');
                    http.send(formdata);
                }else{
                    document.querySelectorAll('.channelElement')[channels[message.slice(14,message.length)]].click();
                }
                break;
            case 2:
                /* user has the channel */
                document.querySelectorAll('.channelElement')[channels[message.slice(14,message.length)]].click();
                break
        }
    }
    http.open('post','/joinChannel');
    http.send(formdata)
}

isJoinChannel=(username,channelID)=>{
    return new Promise(resolve=>{
        var formdata=new FormData();
        formdata.append('username',username);
        formdata.append('channelID',channelID);

        var http=new XMLHttpRequest();
        http.onloadend=e=>{
            var response=Number(JSON.parse(e.target.responseText));
            resolve(response)
        }
        http.open('post','/isJoinChannel');
        http.send(formdata);
    })
}

scrollTo=()=>{
    document.querySelector('.chat-box').scrollTo(0,document.querySelector('.chat-box').scrollHeight)
}

send=async(message,time)=>{
    var sendMessage=await document.createElement('div');
    await sendMessage.classList.add('sent-massage');
    await sendMessage.classList.add('massage');

    var textArea=await document.createElement('div');
    await textArea.classList.add('text-area');

    var messageContent=await document.createElement('p');
    await messageContent.classList.add('massage-content');
    messageContent.innerHTML=message;

    var firstString=await message.slice(0,6);
    var groupFirstString=await message.slice(0,12);
    var channelFirstString=await message.slice(0,14);

    if(firstString==='@bt.o/'){
        messageContent.classList.add('bychatLink');

        textArea.addEventListener('click',()=>{
            addToContactByLink(message);
        })
    }
    if(groupFirstString==='@bt.o/group/'){
        messageContent.classList.add('bychatLink');

        textArea.addEventListener('click',()=>{
            seeGroup(message);
        })
    }
    if(channelFirstString==='@bt.o/channel/'){
        messageContent.classList.add('bychatLink');

        textArea.addEventListener('click',()=>{
            seeChannel(message);
        })
    }

    var spn=await document.createElement('span');
    spn.innerHTML=time;

    await textArea.appendChild(messageContent);
    await textArea.appendChild(spn);
    await sendMessage.appendChild(textArea);
    await chatBox.appendChild(sendMessage);

    scrollTo();
}

var videoMarginLeft=0;
var videoMarginTop=0;

// const myEventEmitter = new EventEmitter();

// const handleMyEvent = (data) => {
//     console.log('Was fired: ', data);
// };

// myEventEmitter.on('testEvent', handleMyEvent);

// myEventEmitter.emit('testEvent', 'hi');
// myEventEmitter.emit('testEvent', 'my name is javad!');

var reactionContent=document.getElementById('reactionContent');
var selectedMessage=null;
var dblclickMessage=null;

sendVideo=async(videoLink,videoExplain,sendTime)=>{
    var sendMessage=await document.createElement('div');
    await sendMessage.classList.add('sent-massage');
    await sendMessage.classList.add('massage');

    // sendMessage.addEventListener('dblclick',e=>{
    //     var x = e.clientX-65;
    //     var y = e.clientY-20;
    //     reactionContent.parentNode.style.top=y+'px';
    //     reactionContent.parentNode.style.left=x+'px';

    //     reactionContent.style.opacity='100%';

    //     selectedMessage=videoLink;
    //     dblclickMessage=sendMessage;
    // })

    var textArea=await document.createElement('div');
    await textArea.classList.add('text-area');
    await textArea.classList.add('frs');

    var linered=await document.createElement('div');
    await linered.classList.add('linered')

    var div=await document.createElement('div');
    
    var a=await document.createElement('a');
    a.href=videoLink;

    var p=await document.createElement('p');
    await p.classList.add('massage-content');
    await p.classList.add('link');
    p.innerHTML=`https://bychat.one/${videoLink.slice(0,9)} ...`;

    await a.appendChild(p);

    await div.appendChild(a);

    var p2=await document.createElement('p');
    await p2.classList.add('massage-content');
    await p2.classList.add('mb5');
    await p2.classList.add('ts');
    p2.innerHTML=videoExplain;

    await div.appendChild(p2);

    var video=await document.createElement('div');
    await video.classList.add('video');
    await video.classList.add('frc');
    await video.classList.add('aic');

    var i=await document.createElement('div');
    await i.classList.add('fa');
    await i.classList.add('fa-play');

    i.addEventListener('click',e=>{
        document.getElementById('playPauseVideo').classList.remove('fa-play');
        document.getElementById('playPauseVideo').classList.add('fa-pause');
        document.getElementById('sendVideoPlay').src=videoLink;
        var x = e.clientX-100
        var y = e.clientY-100

        document.getElementById('videoContent').parentNode.style.top=y+"px";
        document.getElementById('videoContent').parentNode.style.left=x+"px";

        document.getElementById('videoContent').style.marginLeft=-x+"px";
        document.getElementById('videoContent').style.marginTop=-y+'px';
        document.getElementById('videoContent').style.width='100vw';
        document.getElementById('videoContent').style.height='100vh';

        document.getElementById('sendVideoPlay').play();
    })

    await video.appendChild(i);

    await div.appendChild(video);

    var reactBox=document.createElement('div');
    reactBox.classList.add('reactBox');
    reactBox.classList.add('dsn');

    div.appendChild(reactBox);

    var spn=await document.createElement('span');
    await spn.classList.add('ts');
    spn.innerHTML=sendTime;

    await div.appendChild(spn);

    await textArea.appendChild(linered);
    await textArea.appendChild(div);

    await sendMessage.appendChild(textArea);

    await chatBox.appendChild(sendMessage)

    scrollTo()
}

sendPicture=async(videoLink,videoExplain,sendTime)=>{
    var sendMessage=await document.createElement('div');
    await sendMessage.classList.add('sent-massage');
    await sendMessage.classList.add('massage');

    var textArea=await document.createElement('div');
    await textArea.classList.add('text-area');
    await textArea.classList.add('frs');

    var linered=await document.createElement('div');
    await linered.classList.add('linered')

    var div=await document.createElement('div');
    
    var a=await document.createElement('a');
    a.href=videoLink;

    var p=await document.createElement('p');
    await p.classList.add('massage-content');
    await p.classList.add('link');
    p.innerHTML=`https://bychat.one/${videoLink.slice(0,9)} ...`;

    await a.appendChild(p);

    await div.appendChild(a);

    var p2=await document.createElement('p');
    await p2.classList.add('massage-content');
    await p2.classList.add('mb5');
    await p2.classList.add('ts');
    p2.innerHTML=videoExplain;

    await div.appendChild(p2);

    var video=await document.createElement('div');
    await video.classList.add('messagePicture');
    video.style.backgroundImage=`url(${videoLink})`;
    await video.classList.add('frc');
    await video.classList.add('aic');

    video.addEventListener('click',()=>{
        document.getElementById('showPicture').style.backgroundImage=`url(${videoLink})`;
        document.getElementById('showPicture').parentNode.classList.remove('dsn');
    })

    await div.appendChild(video);

    var reactBox=document.createElement('div');
    reactBox.classList.add('reactBox');
    reactBox.classList.add('dsn');

    div.appendChild(reactBox);

    var spn=await document.createElement('span');
    await spn.classList.add('ts');
    spn.innerHTML=sendTime;

    await div.appendChild(spn);

    await textArea.appendChild(linered);
    await textArea.appendChild(div);

    await sendMessage.appendChild(textArea);

    await chatBox.appendChild(sendMessage)

    scrollTo()
}
sendFileFunc=async(videoLink,videoExplain,sendTime)=>{
    var sendMessage=await document.createElement('div');
    await sendMessage.classList.add('sent-massage');
    await sendMessage.classList.add('massage');

    var textArea=await document.createElement('div');
    await textArea.classList.add('text-area');
    await textArea.classList.add('frs');

    var linered=await document.createElement('div');
    await linered.classList.add('linered')

    var div=await document.createElement('div');
    
    var a=await document.createElement('a');
    a.href=videoLink;

    var p=await document.createElement('p');
    await p.classList.add('massage-content');
    await p.classList.add('link');
    p.innerHTML=`https://bychat.one/${videoLink.slice(0,9)} ...`;

    await a.appendChild(p);

    await div.appendChild(a);

    var p2=await document.createElement('p');
    await p2.classList.add('massage-content');
    await p2.classList.add('mb5');
    await p2.classList.add('ts');
    p2.innerHTML=videoExplain;

    await div.appendChild(p2);

    var video=await document.createElement('div');
    await video.classList.add('messagefile');
    await video.classList.add('frc');
    await video.classList.add('aic');
    await video.classList.add('sendFileStyle');

    var i=document.createElement('i');
    i.classList.add('fa');
    i.classList.add('fa-file');

    video.appendChild(i);

    await div.appendChild(video);

    var reactBox=document.createElement('div');
    reactBox.classList.add('reactBox');
    reactBox.classList.add('dsn');

    div.appendChild(reactBox);

    var spn=await document.createElement('span');
    await spn.classList.add('ts');
    spn.innerHTML=sendTime;

    await div.appendChild(spn);

    await textArea.appendChild(linered);
    await textArea.appendChild(div);

    await sendMessage.appendChild(textArea);

    await chatBox.appendChild(sendMessage)

    scrollTo()
}

var convertSecond=(second,duration)=>{
    return `${new Date(second * 1000).toISOString().slice(14, 19)} / ${new Date(duration * 1000).toISOString().slice(14, 19)}`;
}

var justConvertSecond=(second)=>{
    return `${new Date(second * 1000).toISOString().slice(14, 19)}`;
}

var beforeMusic=null;
var beforeI=null;

sendMusic=async(address,musicRealName,sendTime,fileTemp)=>{
    var time=await document.createElement('div');
    await time.classList.add('pa');
    await time.classList.add('musicTimer');

    var audio=await new Audio();
    audio.onloadedmetadata=()=>{
        time.innerHTML=`00:00 / ${justConvertSecond(audio.duration)}`
    }
    audio.src=address;

    var frfe=await document.createElement('div');
    await frfe.classList.add('frfe');

    var sendMessage=await document.createElement('div');
    await sendMessage.classList.add('sent-massage');
    await sendMessage.classList.add('massage');
    await sendMessage.classList.add('w80');

    var textArea=await document.createElement('div');
    await textArea.classList.add('text-area');
    await textArea.classList.add('frs');

    var linered=await document.createElement('div');
    await linered.classList.add('linered');

    var div=await document.createElement('div');

    var a=await document.createElement('a');
    a.href=address;

    var p=await document.createElement('p');
    await p.classList.add('massage-content');
    await p.classList.add('link');
    p.innerHTML=`https://bychat.one/${address.slice(0,9)} ...`;

    var p2=await document.createElement('p');
    await p2.classList.add('massage-content');
    await p2.classList.add('mb5');
    await p2.classList.add('ts');
    p2.innerHTML=musicRealName;

    var music=await document.createElement('div');
    await music.classList.add('music');
    await music.classList.add('frs');
    await music.classList.add('aic');
    await music.classList.add('rblue');
    await music.classList.add('pr');

    var circle=await document.createElement('div');
    await circle.classList.add('circle');
    await circle.classList.add('frc');
    await circle.classList.add('aic');
    await circle.classList.add('darkblue');

    var moveLine=await document.createElement('input');
    moveLine.type='range';
    moveLine.min=0;
    moveLine.max=100;
    moveLine.value=0;
    moveLine.classList.add('slider');
    moveLine.id='myRange';

    var ts=await document.createElement('span');
    await ts.classList.add('ts');
    ts.innerHTML=sendTime;

    var i=await document.createElement('i');
    await i.classList.add('fa');
    await i.classList.add('fa-play');
    await i.classList.add('fs20');
    await i.classList.add('ns');
    await i.classList.add('darkblue1')

    await div.appendChild(a);
    await a.appendChild(p);

    await div.appendChild(p2);

    await div.appendChild(music);
    await music.appendChild(circle);

    await circle.appendChild(i);

    i.addEventListener('click',()=>{
        if((beforeMusic!==audio)&&(beforeMusic!==null)){
            beforeMusic.pause();
            beforeI.classList.add('fa-play');
            beforeI.classList.remove('fa-pause');
        }

        if(i.classList.contains('fa-play')){
            i.classList.remove('fa-play');
            i.classList.add('fa-pause');
            audio.play();
        }else{
            i.classList.add('fa-play');
            i.classList.remove('fa-pause');
            audio.pause();
        }

        beforeMusic=audio;
        beforeI=i;
    })

    audio.addEventListener('timeupdate',e=>{
        time.innerHTML=convertSecond(e.target.currentTime,e.target.duration);

        moveLine.value=Math.round((e.target.currentTime/e.target.duration)*100);

        if(e.target.currentTime===e.target.duration){
            i.classList.add('fa-play');
            i.classList.remove('fa-pause');
            audio.currentTime=0;
            audio.pause();
        }
    })

    moveLine.addEventListener('input',function(){
        audio.currentTime=(audio.duration*this.value)/100
    })

    await music.appendChild(moveLine);
    await music.appendChild(time);

    await div.appendChild(ts);

    await textArea.appendChild(linered);
    await textArea.appendChild(div);

    await sendMessage.appendChild(textArea);

    await frfe.appendChild(sendMessage);

    await chatBox.appendChild(frfe);

    scrollTo()
}

recieve=async(message,time)=>{
    var recievedMassage=await document.createElement('div');
    await recievedMassage.classList.add('recieved-massage');
    await recievedMassage.classList.add('massage');

    var textArea=await document.createElement('div');
    await textArea.classList.add('text-area');

    var messageContent=await document.createElement('p');
    await messageContent.classList.add('massage-content');
    messageContent.innerHTML=message;

    var firstString=await message.slice(0,6);
    var groupFirstString=await message.slice(0,12);
    var channelFirstString=await message.slice(0,14);

    if(firstString==='@bt.o/'){
        messageContent.classList.add('bychatLink');

        textArea.addEventListener('click',()=>{
            addToContactByLink(message);
        })
    }
    if(groupFirstString==='@bt.o/group/'){
        messageContent.classList.add('bychatLink');

        textArea.addEventListener('click',()=>{
            seeGroup(message);
        })
    }
    if(channelFirstString==='@bt.o/channel/'){
        messageContent.classList.add('bychatLink');

        textArea.addEventListener('click',()=>{
            seeChannel(message);
        })
    }

    var spn=await document.createElement('span');
    spn.innerHTML=time;

    await textArea.appendChild(messageContent);
    await textArea.appendChild(spn);
    await recievedMassage.appendChild(textArea);
    await chatBox.appendChild(recievedMassage);
    scrollTo()
}

recieveVideo=async(videoLink,videoExplain,recieveTime)=>{
    var recievedMassage=await document.createElement('div');
    await recievedMassage.classList.add('recieved-massage');
    await recievedMassage.classList.add('massage');

    var textArea=await document.createElement('div');
    await textArea.classList.add('text-area');
    await textArea.classList.add('frs');

    var line=await document.createElement('div');
    await line.classList.add('line');

    var div=await document.createElement('div');
    
    var a=await document.createElement('a');
    a.href=videoLink;

    var p=await document.createElement('p');
    await p.classList.add('massage-content');
    await p.classList.add('link');
    p.innerHTML=videoLink;

    await a.appendChild(p);
    await div.appendChild(a);

    var p2=await document.createElement('p');
    await p2.classList.add('massage-content');
    await p2.classList.add('mb5');
    await p2.classList.add('ts');
    p2.innerHTML=videoExplain;

    await div.appendChild(p2);

    var video=await document.createElement('div');
    await video.classList.add('video');
    await video.classList.add('frc');
    await video.classList.add('aic');

    var i=await document.createElement('i');
    await i.classList.add('fa');
    await i.classList.add('fa-play');

    i.addEventListener('click',e=>{
        document.getElementById('playPauseVideo').classList.remove('fa-play');
        document.getElementById('playPauseVideo').classList.add('fa-pause');
        document.getElementById('sendVideoPlay').src=videoLink;
        var x = e.clientX-100
        var y = e.clientY-100

        document.getElementById('videoContent').parentNode.style.top=y+"px";
        document.getElementById('videoContent').parentNode.style.left=x+"px";

        document.getElementById('videoContent').style.marginLeft=-x+"px";
        document.getElementById('videoContent').style.marginTop=-y+'px';
        document.getElementById('videoContent').style.width='100vw';
        document.getElementById('videoContent').style.height='100vh';

        document.getElementById('sendVideoPlay').play();
    })

    await video.appendChild(i);

    await div.appendChild(video);

    var spn=await document.createElement('span');
    await spn.classList.add('ts');
    spn.innerHTML=recieveTime;

    await div.appendChild(spn);

    await textArea.appendChild(line);
    await textArea.appendChild(div);

    await recievedMassage.appendChild(textArea);

    await chatBox.appendChild(recievedMassage);

    scrollTo()
}

recievePicture=async(videoLink,videoExplain,recieveTime)=>{
    var recievedMassage=await document.createElement('div');
    await recievedMassage.classList.add('recieved-massage');
    await recievedMassage.classList.add('massage');

    var textArea=await document.createElement('div');
    await textArea.classList.add('text-area');
    await textArea.classList.add('frs');

    var line=await document.createElement('div');
    await line.classList.add('line');

    var div=await document.createElement('div');
    
    var a=await document.createElement('a');
    a.href=videoLink;

    var p=await document.createElement('p');
    await p.classList.add('massage-content');
    await p.classList.add('link');
    p.innerHTML=videoLink;

    await a.appendChild(p);
    await div.appendChild(a);

    var p2=await document.createElement('p');
    await p2.classList.add('massage-content');
    await p2.classList.add('mb5');
    await p2.classList.add('ts');
    p2.innerHTML=videoExplain;

    await div.appendChild(p2);

    var video=await document.createElement('div');
    await video.classList.add('messagePicture');
    await video.classList.add('frc');
    await video.classList.add('aic');
    video.style.backgroundImage=`url(${videoLink})`;

    await div.appendChild(video);

    var spn=await document.createElement('span');
    await spn.classList.add('ts');
    spn.innerHTML=recieveTime;

    await div.appendChild(spn);

    await textArea.appendChild(line);
    await textArea.appendChild(div);

    await recievedMassage.appendChild(textArea);

    await chatBox.appendChild(recievedMassage);

    scrollTo()
}

recieveMusic=async(address,musicRealName,sendTime,fileTemp)=>{
    var time=await document.createElement('div');
    await time.classList.add('pa');
    await time.classList.add('musicTimer');
    await time.classList.add('darkGreen');

    var audio=await new Audio();
    audio.onloadedmetadata=()=>{
        time.innerHTML=`00:00 / ${justConvertSecond(audio.duration)}`
    }
    audio.src=address;

    var frfe=await document.createElement('div');
    await frfe.classList.add('frfe');

    var sendMessage=await document.createElement('div');
    await sendMessage.classList.add('recieved-massage');
    await sendMessage.classList.add('massage');

    var textArea=await document.createElement('div');
    await textArea.classList.add('text-area');
    await textArea.classList.add('frs');

    var linered=await document.createElement('div');
    await linered.classList.add('line');

    var div=await document.createElement('div');

    var a=await document.createElement('a');
    a.href=address;

    var p=await document.createElement('p');
    await p.classList.add('massage-content');
    await p.classList.add('link');
    await p.classList.add('newStyle');
    p.innerHTML=`https://bychat.one/${address.slice(0,9)} ...`;

    var p2=await document.createElement('p');
    await p2.classList.add('massage-content');
    await p2.classList.add('mb5');
    await p2.classList.add('ts');
    p2.innerHTML=musicRealName;

    var music=await document.createElement('div');
    await music.classList.add('music');
    await music.classList.add('frs');
    await music.classList.add('aic');
    await music.classList.add('nsh');
    await music.classList.add('pr');

    var circle=await document.createElement('div');
    await circle.classList.add('circle');
    await circle.classList.add('frc');
    await circle.classList.add('aic');

    var moveLine=await document.createElement('input');
    moveLine.type='range';
    moveLine.min=0;
    moveLine.max=100;
    moveLine.value=0;
    moveLine.classList.add('sliderRecieve');
    moveLine.id='myRange';

    var ts=await document.createElement('span');
    await ts.classList.add('ts');
    ts.innerHTML=sendTime;

    var i=await document.createElement('i');
    await i.classList.add('fa');
    await i.classList.add('fa-play');
    await i.classList.add('fs20');
    await i.classList.add('ns');

    await div.appendChild(a);
    await a.appendChild(p);

    await div.appendChild(p2);

    await div.appendChild(music);
    await music.appendChild(circle);

    await circle.appendChild(i);

    i.addEventListener('click',()=>{
        if((beforeMusic!==audio)&&(beforeMusic!==null)){
            beforeMusic.pause();
            beforeI.classList.add('fa-play');
            beforeI.classList.remove('fa-pause');
        }

        if(i.classList.contains('fa-play')){
            i.classList.remove('fa-play');
            i.classList.add('fa-pause');
            audio.play();
        }else{
            i.classList.add('fa-play');
            i.classList.remove('fa-pause');
            audio.pause();
        }

        beforeMusic=audio;
        beforeI=i;
    })

    audio.addEventListener('timeupdate',e=>{
        time.innerHTML=convertSecond(e.target.currentTime,e.target.duration);

        moveLine.value=Math.round((e.target.currentTime/e.target.duration)*100);

        if(e.target.currentTime===e.target.duration){
            i.classList.add('fa-play');
            i.classList.remove('fa-pause');
            audio.currentTime=0;
            audio.pause();
        }
    })

    moveLine.addEventListener('input',function(){
        audio.currentTime=(audio.duration*this.value)/100
    })

    await music.appendChild(moveLine);
    await music.appendChild(time);

    await div.appendChild(ts);

    await textArea.appendChild(linered);
    await textArea.appendChild(div);

    await sendMessage.appendChild(textArea);

    await frfe.appendChild(sendMessage);

    await chatBox.appendChild(frfe);

    scrollTo()
}

recieveFileFunc=async(address,fileRealName,sendTime)=>{
    var recievedMassage=await document.createElement('div');
    await recievedMassage.classList.add('recieved-massage');
    await recievedMassage.classList.add('massage');

    var textArea=await document.createElement('div');
    await textArea.classList.add('text-area');
    await textArea.classList.add('frs');

    var line=await document.createElement('div');
    await line.classList.add('line');

    await textArea.appendChild(line);

    var div=await document.createElement('div');

    var a=await document.createElement('a');
    a.href=address;

    var p=await document.createElement('p');
    await p.classList.add('massage-content');
    await p.classList.add('link');
    p.innerHTML=address;

    await a.appendChild(p);

    await div.appendChild(a);

    var p2=await document.createElement('div');
    await p2.classList.add('massage-content');
    await p2.classList.add('mb5');
    await p2.classList.add('ts');
    await p2.classList.add('fs12');
    p2.innerHTML=fileRealName;

    await div.appendChild(p2);

    var messagefile=await document.createElement('div');
    await messagefile.classList.add('messagefile');
    await messagefile.classList.add('frc');
    await messagefile.classList.add('aic');

    var i=await document.createElement('i');
    await i.classList.add('fa');
    await i.classList.add('fa-file');

    await messagefile.appendChild(i);

    await div.appendChild(messagefile);

    var spn=await document.createElement('span');
    await spn.classList.add('ts');
    spn.innerHTML=sendTime;

    await div.appendChild(spn);

    await textArea.appendChild(div);

    await recievedMassage.appendChild(textArea);

    await chatBox.appendChild(recievedMassage);
}

createContact=(type,contact)=>{
    var msgNum=contact.unreadMsgNumber
    var chatBox=document.createElement('div');
    
    var title=document.createElement('div');
    title.classList.add('title');

    var chnl=document.createElement('div');
    chnl.classList.add('pa');
    chnl.classList.add('channelIcon');
    chnl.classList.add('ffp');

    var profilePicture=document.createElement('div');
    profilePicture.classList.add('contactProfilePic');
    profilePicture.classList.add('pa');

    switch(type){
        case 'contact':
            title.innerHTML=contact.contactName;
            chatBox.classList.add('messagePrivateElement')
            if(contact.profilePicAddress){
                profilePicture.style.backgroundImage=`url(${contact.profilePicAddress})`;
            }
            break;
        case 'channel':
            title.innerHTML=contact.channelName;
            title.classList.add('channelTitle');
            chatBox.classList.add('channelElement');
            if(contact.channelPicture){
                profilePicture.style.backgroundImage=`url(${contact.channelPicture})`;
            }
            chnl.innerHTML='channel';
            chatBox.appendChild(chnl);
            break;
        case 'group':
            title.innerHTML=contact.groupName;
            title.classList.add('groupTitle');
            chatBox.classList.add('groupElement');
            if(contact.groupPicture){
                profilePicture.style.backgroundImage=`url(${contact.groupPicture})`;
            }
            chnl.innerHTML='group';
            chatBox.appendChild(chnl);
            break;
    }
    chatBox.appendChild(profilePicture);

    var p=document.createElement('p');
    p.classList.add('summary');
    p.innerHTML=contact.lastMessage.slice(0,20);

    var iTag=document.createElement('i');
    iTag.classList.add('fa-solid');
    iTag.classList.add('fa-thumbtack')

    var div=document.createElement('div');
    if((type==='channel')&&(contact.admin===username)){
        div.setAttribute('style','display:none !important;')
    }
    div.classList.add('circleNum');
    div.classList.add('fcc');
    div.classList.add('fs14');
    div.innerHTML=msgNum;
    if(Number(msgNum)){
        div.classList.add('dfi');
    }else{
        div.classList.add('dni');
    }
    
    chatBox.appendChild(title);
    chatBox.appendChild(p);
    chatBox.appendChild(iTag);
    chatBox.appendChild(div);
    chatBox.classList.add('chat-thing');
    if(contact.pined){
        chatBox.classList.add('pinned');
    };

    return chatBox;
}

sliceMsg=(type,msg,x)=>{
    var tag=null;
    switch(type){
        case 'privateMessage':
            tag=document.querySelectorAll('.messagePrivateElement')[x];
            break;
        case 'channelMessage':
            tag=document.querySelectorAll('.channelElement')[x];
            break;
        case 'groupMessage':
            tag=document.querySelectorAll('.groupElement')[x];
            break;
    }
    tag.querySelector('.summary').innerHTML=`${msg.slice(0,20)} ...`;
}

changeMsgNumberAndLastChat=(type,x,msg)=>{
    var tag=null;
    /* change unread messege */
    switch(type){
        case 'privateMessage':
            tag=document.querySelectorAll('.messagePrivateElement')[x];
            break;
        case 'channelMessage':
            tag=document.querySelectorAll('.channelElement')[x];
            break;
        case 'groupMessage':
            tag=document.querySelectorAll('.groupElement')[x];
            break;
    }
    var egnoreChat=Number(tag.querySelector('.circleNum').innerText);
    ++egnoreChat;
    tag.querySelector('.circleNum').setAttribute('style','display: flex !important;');
    tag.querySelector('.circleNum').innerHTML=egnoreChat;
    /**********************/

    /* chamge last messege */
    tag.querySelector('.summary').innerHTML=`${msg.slice(0,20)} ...`;
    /**********************/
}

resetContact=target=>{
    target.querySelector('.circleNum').innerHTML=0;
    target.querySelector('.circleNum').setAttribute('style',
    'display:none !important;');

    updateToZero(username,recieverInfo.name)
}

resetChannel=(target,channelID,username)=>{
    target.querySelector('.circleNum').innerHTML=0;
    target.querySelector('.circleNum').setAttribute('style',
    'display:none !important;');

    updateToZeroChannel(channelID,username);
}

resetGroup=(target,groupID,username)=>{
    target.querySelector('.circleNum').innerHTML=0;
    target.querySelector('.circleNum').setAttribute('style',
    'display:none !important;');

    updateToZeroGroup(groupID,username);
}

msgNumber=(type,x)=>{
    var tag=null;
    switch(type){
        case 'privateMessage':
            tag=document.querySelectorAll('.messagePrivateElement')[x];
            break;
        case 'channelMessage':
            tag=document.querySelectorAll('.channelElement')[x];
            break;
    }
    var n=Number(tag.querySelector('.circleNum').innerText);
    return n;
}

updateMsgNumber=(username,sender,x)=>{
    var formdata=new FormData();
    formdata.append('username',username),
    formdata.append('contactName',sender)
    formdata.append('number',msgNumber('privateMessage',x))

    var req=new XMLHttpRequest()
    req.open('post','/unreadMsgNumber');
    req.send(formdata)
}

updateToZero=(username,sender)=>{
    var formdata=new FormData();
    formdata.append('username',username),
    formdata.append('contactName',sender)

    var req=new XMLHttpRequest()
    req.open('post','/unreadToZero')
    req.send(formdata)
}

updateToZeroChannel=(channelID,username)=>{
    var formdata=new FormData();
    formdata.append('username',username),
    formdata.append('channelID',channelID)

    var req=new XMLHttpRequest()
    req.open('post','/unreadToZeroChannel')
    req.send(formdata)
}

updateToZeroGroup=(groupID,username)=>{
    var formdata=new FormData();
    formdata.append('username',username),
    formdata.append('groupID',groupID)

    var req=new XMLHttpRequest()
    req.open('post','/unreadToZeroGroup')
    req.send(formdata)
}

fileContentFunction=(fileName)=>{
    document.querySelector('.input-massage').parentNode.classList.add('dsn');
    document.getElementById('sendFileBtn').parentNode.classList.add('w100');
    document.getElementById('sendFileBtn').classList.remove('dsn');
    document.getElementById('fileInputName').classList.remove('dsn');
    document.getElementById('fileInputName').innerHTML=fileName;
}

fileContentFunctionR=()=>{
    document.querySelector('.input-massage').parentNode.classList.remove('dsn');
    document.getElementById('sendFileBtn').parentNode.classList.remove('w100');
    document.getElementById('sendFileBtn').classList.add('dsn');
    document.getElementById('fileInputName').classList.add('dsn');
    document.getElementById('fileInputName').innerHTML="";
}

date=()=>{
    return `${new Date().getHours()}:${new Date().getMinutes()}`;
}

reciveFile=async(fileTemp,address,musicRealName,recieveTime)=>{
    switch (fileTemp){
        case 'mp4':
            await recieveVideo(address,musicRealName,recieveTime);
            break;
        case 'mp3':
            await recieveMusic(address,musicRealName,recieveTime);
            break;
        case 'jpg':
            await recievePicture(address,musicRealName,recieveTime);
            break;
        case 'jpeg':
            await recievePicture(address,musicRealName,recieveTime);
            break;
        case 'png':
            await recievePicture(address,musicRealName,recieveTime);
            break;
        default:
            await recieveFileFunc(address,musicRealName,recieveTime);
            break;
    }
}

sendFileFunction=async(fileTemp,fileAddress,fileRealName,date)=>{
    switch(fileTemp){
        case 'mp4':
            await sendVideo(fileAddress,fileRealName,date);
            break;
        case 'mp3':
            await sendMusic(fileAddress,fileRealName,date,fileTemp);
            break;
        case 'webp':
            await sendMusic(fileAddress,fileRealName,date,fileTemp);
            break;
        case 'jpg':
            await sendPicture(fileAddress,fileRealName,date,fileTemp);
            break;
        case 'jpeg':
            await sendPicture(fileAddress,fileRealName,date,fileTemp);
            break;
        case 'png':
            await sendPicture(fileAddress,fileRealName,date,fileTemp);
            break;
        default:
            await sendFileFunc(fileAddress,fileRealName,date);
            break;
    }
}

var accountProfilePic=document.getElementById('account-profile-pic');
var profilePic=document.querySelector('.profile-pic');
var accountName=document.querySelector('.account-name');
var ID=document.getElementById('ID');
var call=document.getElementById('phoneNumber');
var channelNameShow=document.getElementById('channelNameShow');

userInformation=(contactName)=>{
    document.getElementById('mainForm').classList.remove('dsn');
    call.parentNode.parentNode.classList.remove('dsn');
    channelNameShow.parentNode.parentNode.classList.add('dsn');
    
    var formdata=new FormData();
    formdata.append("user",contactName);

    var http=new XMLHttpRequest();

    http.onloadend=e=>{
        var contactInfo=JSON.parse(e.target.responseText)[0];

        accountName.innerHTML=contactInfo.username;
        ID.innerHTML=`@bt.o/${contactInfo.username}`;
        ID.addEventListener('click',()=>{
            copyID();
            navigator.clipboard.writeText(`@bt.o/${contactInfo.username}`);
        })
        call.innerHTML=contactInfo.phoneNumber;
        if(!contactInfo.profilePicAddress){
            accountProfilePic.style.backgroundImage='url(img/singer.webp)';
            profilePic.style.backgroundImage='url(img/singer.webp)';
        }else{
            accountProfilePic.style.backgroundImage=`url(${contactInfo.profilePicAddress})`;
            profilePic.style.backgroundImage=`url(${contactInfo.profilePicAddress})`;
        }
    }

    http.open('post','/userInformation');
    http.send(formdata);
}

userJustInformation=(contactName)=>{
    return new Promise(resolve=>{
        var formdata=new FormData();
        formdata.append("user",contactName);

        var http=new XMLHttpRequest();

        http.onloadend=e=>{
            var contactInfo=JSON.parse(e.target.responseText)[0];
            resolve(contactInfo);
        }

        http.open('post','/userInformation');
        http.send(formdata);
    })
}

var saveMessageOption=document.querySelectorAll('.optionName')[0];
var saveMessageForm=document.getElementById('saveMessageForm');
var mainForm=document.getElementById('mainForm');
var saveForm=saveMessageForm.querySelector('form');
var response=document.querySelector('.response');

querySaveMessage=(username)=>{
    var formdata=new FormData();
    formdata.append('username',username);

    var http=new XMLHttpRequest();
    http.onloadend=e=>{
        var saveMessages=JSON.parse(e.target.responseText);
        
        saveMessages.forEach(message=>{
            send(message.message,message.date);
        });
    }
    http.open('post','/querySaveMessage');
    http.send(formdata);
}

addContactTag=()=>{
    optionContainer.innerHTML="";

    var div=document.createElement('div');
    div=Main.addClass(div,'pa mc frfe');

    var i=Main.createElem('i','fa fa-multiply mr10 mt5 cc');

    div.appendChild(i);

    i.addEventListener('click',()=>{
        removeAddContact();
    })

    var form=Main.createElem('form','addContactBox fcc aic pr','addContactForm');

    form.innerHTML=`
    <div class="ic">
        <div class="ac">add contact</div>
    </div>
    <div class="fcc ic">
        <div class="response pa cr"></div>
        <input type="text" class="addContactInput mt10" placeholder="* inter your contact name">
        <input type="text" class="addContactInput mt10" placeholder="* inter your contact family">
        <input type="text" class="addContactInput mt10" placeholder="* inter your contact phone">
    </div>
    <div class="ic frfe">
        <button type="submit" class="saveContact mt15">save</button>
    </div>
    `;

    form.addEventListener('submit',e=>{
        var addContactInput=form.querySelectorAll('.addContactInput');
        var response=document.querySelector('.response');
        addContactFormFunction(e,addContactInput,response);
    })

    optionContainer.appendChild(div);
    optionContainer.appendChild(form);
}

const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
  '((\\d{1,3}\\.){3}\\d{1,3}))'+
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
  '(\\?[;&a-z\\d%_.~+=-]*)?'+
  '(\\#[-a-z\\d_]*)?$','i');
    return !!urlPattern.test(urlString);
}

generalSetting=()=>{
    mainForm.classList.remove('dsn');
    saveMessageForm.classList.add('dsn');
    
    document.querySelector('.chat-section').classList.remove('dsn');
    newMessage.classList.add('dsn');

    if(768<=document.body.scrollWidth){
        rightCol[0].classList.remove('dsn');
        newMessage.classList.add('dsn');
    }else{
        document.querySelector('.left-col').classList.add('dsn');
        document.querySelector('.right-col').classList.remove('dsn')
        arrowLeft.classList.remove('dsn');
    }

    chatBox.innerHTML=""
}

copyID=()=>{
    document.querySelector('.copyed').style.opacity="100%";
    setTimeout(()=>{
        document.querySelector('.copyed').style.opacity="0";
    },1*1000);
}

channelInformation=(channelID)=>{
    call.parentNode.parentNode.classList.add('dsn');
    channelNameShow.parentNode.parentNode.classList.remove('dsn');
    channelNameShow.parentNode.querySelector('p').innerHTML='channel name';

    var formdata=new FormData();
    formdata.append("channelID",channelID);

    var http=new XMLHttpRequest();

    http.onloadend=e=>{
        var channelInf=JSON.parse(e.target.responseText)[0];

        if(channelInf.admin!==username){
            document.getElementById('mainForm').classList.add('dsn');
        }
        accountName.innerHTML=channelInf.channelName;
        ID.innerHTML=`@bt.o/channel/${channelInf.channelID}`;
        ID.addEventListener('click',()=>{
            copyID();
            navigator.clipboard.writeText(`@bt.o/channel/${channelInf.channelID}`);
        })
        if(!channelInf.channelPicture){
            accountProfilePic.style.backgroundImage='url(img/singer.webp)';
            profilePic.style.backgroundImage='url(img/singer.webp)';
        }else{
            accountProfilePic.style.backgroundImage=`url(${channelInf.channelPicture})`;
            profilePic.style.backgroundImage=`url(${channelInf.channelPicture})`;
        }
        bio.innerHTML=channelInf.channelDescription;
        channelNameShow.innerHTML=channelInf.channelName;
    }

    http.open('post','/channelInformation');
    http.send(formdata);
}

groupInformation=(groupID)=>{
    call.parentNode.parentNode.classList.add('dsn');
    channelNameShow.parentNode.parentNode.classList.remove('dsn');
    channelNameShow.parentNode.querySelector('p').innerHTML='group name';

    var formdata=new FormData();
    formdata.append("groupID",groupID);

    var http=new XMLHttpRequest();

    http.onloadend=e=>{
        var groupInf=JSON.parse(e.target.responseText)[0];

        accountName.innerHTML=groupInf.groupName;
        ID.innerHTML=`@bt.o/group/${groupInf.groupID}`;
        ID.addEventListener('click',()=>{
            copyID();
            navigator.clipboard.writeText(`@bt.o/group/${groupInf.groupID}`);
        })
        if(!groupInf.groupPicture){
            accountProfilePic.style.backgroundImage='url(img/singer.webp)';
            profilePic.style.backgroundImage='url(img/singer.webp)';
        }else{
            accountProfilePic.style.backgroundImage=`url(${groupInf.groupPicture})`;
            profilePic.style.backgroundImage=`url(${groupInf.groupPicture})`;
        }
        bio.innerHTML=groupInf.groupDescription;
        channelNameShow.innerHTML=groupInf.groupName;
    }

    http.open('post','/groupInformation');
    http.send(formdata);
}

joinOrLeft.addEventListener('click',()=>{
    var innerText=joinOrLeft.textContent;
    if(groupActive){
        if(innerText==='join'){
            joinOrLeft.innerHTML='left';
            var formdata=new FormData();
            formdata.append('username',myAccountInformation.username);
            formdata.append('phoneNumber',myAccountInformation.phoneNumber);
            formdata.append('groupID',nowGroup.groupID);
            formdata.append('groupName',nowGroup.groupName);
    
            var http=new XMLHttpRequest();
            http.open('post','/joinToGroup');
            http.send(formdata);
        }else{
            joinOrLeft.innerHTML='join';

            var formdata=new FormData();
            formdata.append('username',username);
            formdata.append('phoneNumber',myAccountInformation.phoneNumber)
            formdata.append('groupID',nowGroup.groupID);
            formdata.append('groupName',nowGroup.groupName)

            var http=new XMLHttpRequest();
            http.open('post','/leftFromGroup');
            http.send(formdata);
        }
    }else{
        if(innerText==='join'){
            joinOrLeft.innerHTML='left';
            var formdata=new FormData();
            formdata.append('username',myAccountInformation.username);
            formdata.append('phoneNumber',myAccountInformation.phoneNumber);
            formdata.append('channelID',nowChannel.channelID);
            formdata.append('channelName',nowChannel.channelName);
    
            var http=new XMLHttpRequest();
            http.open('post','/joinToChannel');
            http.send(formdata);
        }else{
            joinOrLeft.innerHTML='join';

            var formdata=new FormData();
            formdata.append('username',username);
            formdata.append('phoneNumber',myAccountInformation.phoneNumber)
            formdata.append('channelID',nowChannel.channelID);
            formdata.append('channelName',nowChannel.channelName)

            var http=new XMLHttpRequest();
            http.open('post','/leftFromChannel');
            http.send(formdata);
        }
    }
})

isJoin=(username,groupID)=>{
    return new Promise(resolve=>{
        var formdata=new FormData();
        formdata.append('username',username);
        formdata.append('groupID',groupID);

        var http=new XMLHttpRequest();
        http.onloadend=e=>{
            var response=Number(JSON.parse(e.target.responseText));
            resolve(response)
        }
        http.open('post','/isJoin');
        http.send(formdata);
    })
}

swapObj=(obj)=>{
    const swapped = Object.entries(obj).map(
      ([key, value]) => [value, key]
    );
  
    return Object.fromEntries(swapped);
}

var videoContent=document.getElementById('videoContent');
var closeVideoBtn=document.getElementById('closeVideo')

closeVideoBtn.addEventListener('click',()=>{
    videoContent.style.width="0";
    videoContent.style.height="0";

    videoContent.style.marginLeft="100px";
    videoContent.style.marginTop="100px";

    document.getElementById('sendVideoPlay').pause();
})

var sendVideoPlay=document.getElementById('sendVideoPlay');
var videoTime=document.getElementById('videoTime');
var videoBarMove=document.getElementById('videoBarMove');
var playPauseVideo=document.getElementById('playPauseVideo');

sendVideoPlay.addEventListener('timeupdate',e=>{
    if(e.target.currentTime){
        videoTime.innerHTML=convertSecond(e.target.currentTime,e.target.duration);
        videoBarMove.value=Math.round((e.target.currentTime/e.target.duration)*100);
    }

    if(e.target.currentTime===e.target.duration){
        sendVideoPlay.pause();
        playPauseVideo.classList.add('fa-play');
        playPauseVideo.classList.remove('fa-pause');
        sendVideoPlay.currentTime=0;
        videoBarMove.value=0;
    }
})

videoBarMove.addEventListener('input',function(){
    sendVideoPlay.currentTime=(this.value*sendVideoPlay.duration)/100;
})

playPauseVideo.addEventListener('click',()=>{
    if(playPauseVideo.classList.contains('fa-play')){
        sendVideoPlay.play();
        playPauseVideo.classList.remove('fa-play');
        playPauseVideo.classList.add('fa-pause');
    }else{
        sendVideoPlay.pause();
        playPauseVideo.classList.add('fa-play');
        playPauseVideo.classList.remove('fa-pause');
    }
})

sendVideoPlay.addEventListener('click',()=>{
    if(playPauseVideo.classList.contains('fa-play')){
        sendVideoPlay.play();
        playPauseVideo.classList.remove('fa-play');
        playPauseVideo.classList.add('fa-pause');
    }else{
        sendVideoPlay.pause();
        playPauseVideo.classList.add('fa-play');
        playPauseVideo.classList.remove('fa-pause');
    }
})

document.getElementById('removeShowPic').addEventListener('click',()=>{
    document.getElementById('showPicture').parentNode.classList.add('dsn');
});

// var reactEmojis=document.querySelectorAll('.reactEmoji');
// var codeNum=1;

// reactEmojisFunc=(reactEmoji,i)=>{
//     return reactEmoji.addEventListener('click',()=>{
//         var reactBox=dblclickMessage.querySelector('.reactBox');
//         reactBox.classList.remove('dsn');
//         switch(i){
//             case 1:
//                 reactBox.innerHTML=`❤️`;
//                 break; 
//             case 2:
//                 reactBox.innerHTML=`🤣`;
//                 break;
//             case 3:
//                 reactBox.innerHTML=`😍`;
//                 break;
//             case 4:
//                 reactBox.innerHTML=`👍`;
//                 break;
//             case 5:
//                 reactBox.innerHTML=`😉`;
//                 break;
//         }
//         console.log(selectedMessage);
//         console.log(i);
//         console.log(dblclickMessage);
//         reactionContent.style.opacity='0';
//     })
// }

// reactEmojis.forEach(reactEmoji=>{
//     reactEmojisFunc(reactEmoji,codeNum);
//     ++codeNum;
// })

messageMusic=()=>{
    var music=new Audio();
    music.src='music/sms.mp3';
    music.onloadedmetadata=()=>{
        music.play();
    }
}