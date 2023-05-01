channelNamespace.on('connect',()=>{
    channelNamespace.emit('online',{
        socketID:socket.id,
        username
    })
})

channelNamespace.on("disconnect", () => {
    channelNamespace.emit('dis',{})
});

var level1=document.getElementById('level1');
var level2=document.getElementById('level2');
var gLevel2=document.getElementById('gLevel2');
var leftLevel1=document.getElementById('leftLevel1');
var allContactBox=document.querySelector('.allContactBox');
var channelForm=document.getElementById('channelForm');
var channelDisc=document.getElementById('channelDiscription');
var wordNum=document.getElementById('wordNum');
var channelContainer=document.getElementById('channelContainer');
var backToMenu=document.getElementById('backToMenu');

var channelName=document.getElementById('channelName');
var channelDescription=document.getElementById('channelDiscription');

var createChannel=document.getElementById('createChannel');
var menuAndContactsContainer=document.getElementById('menuAndContactsContainer');
var channelPicture=document.getElementById('channelPicture');

var selectedContacts=new Object();

createChannel.addEventListener('click',()=>{
    document.getElementById('endOfCreateChannel').classList.add('dsn');
    channelForm.classList.remove('dsn');

    channelNamespace.emit('online',{
        message:"channel front emiter!"
    })
    var formdata=new FormData();
    formdata.append('username',username);

    var http=new XMLHttpRequest();
    http.onloadend=e=>{
        var contacts=JSON.parse(e.target.responseText);
        createContactForCreateChannel(contacts.length,contacts);
    }
    http.open('post','/username');
    http.send(formdata);

    menuAndContactsContainer.classList.add('dsn');
    channelContainer.classList.remove('dsn');
    var classNames=['w20vw','w30vw','w70vw'];
    classNames.forEach(className=>{
        if(menuContent.classList.contains(className)){
            menuContent.classList.remove(className);
        };
    });
    menuContent.classList.add('dsn');
})

backToMenu.addEventListener('click',()=>{
    menuAndContactsContainer.classList.remove('dsn');
    channelContainer.classList.add('dsn');
    menuContent.classList.remove('dsn');
})

gLevel2.addEventListener('click',()=>{
    level1.style.width="0";
    level2.style.width="100%";
});
leftLevel1.addEventListener('click',e=>{
    e.target.classList.remove('dsn');
    level1.style.width="100%";
    level2.style.width="0";
});

createContactForCreateChannel=(arrayLength,contacts)=>{
    allContactBox.innerHTML="";
    [...Array(arrayLength).keys()].forEach(item=>{
        var div=document.createElement('div');
        div.classList.add('contactChannel');
        div.classList.add('mt10');
        div.classList.add('frsb');
        div.classList.add('aic');
        div.classList.add('tran');

        div.innerHTML=`
        <div class="frfs aic">
            <div class="dsn">${item}</div>
            <div>
                <div class="contactPictureChannel ml10"></div>
            </div>
            <div class="informationChannel ml10">
                <div class="capit fs14 cgray fwb">${contacts[item].contactName}</div>
                <div class="fs12 ffp cgray">${contacts[item].contactPhone}</div>
            </div>
        </div>
        <div class="greenSelect"></div>
        `;
        div.addEventListener('click',()=>{
            var contactID=item;

            var channelMember=new Object();
            channelMember.username=contacts[item].contactName;
            channelMember.phoneNumber=contacts[item].contactPhone;

            if(div.querySelector('.greenSelect').classList.contains('fillCir')){
                div.querySelector('.greenSelect').classList.remove('fillCir');
                div.classList.remove('setSelectStyle');
                delete selectedContacts[item];
            }else{
                div.querySelector('.greenSelect').classList.add('fillCir');
                div.classList.add('setSelectStyle');
                selectedContacts[contactID]=channelMember;
            };
        });
        allContactBox.appendChild(div);
    })
};

channelForm.addEventListener('submit',e=>{
    e.preventDefault();
    userJustInformation(username)
    .then(info=>{
        var file=channelPicture.files[0];

        var formdata=new FormData();
        formdata.append('channelMember',JSON.stringify(Object.values(selectedContacts)));
        formdata.append('channelName',channelName.value);
        formdata.append('channelDescription',channelDescription.value);
        formdata.append('username',username);
        formdata.append('accountInformation',JSON.stringify(Object.values(info)));
        formdata.append('channelPicture',file)

        var http=new XMLHttpRequest();
        http.onloadend=e=>{
            new Promise(resolve=>{
                var AllInfo=JSON.parse(e.target.responseText)
                var channel=AllInfo.channel;
                var channelMember=AllInfo.selectedContacts;

                channelNamespace.emit('create-channel',{
                    channelID:channel.channelID,
                    channelMember:channelMember
                })

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
                    resetGroup(channelBox,channel.channelID,username)
                });
                var contactContai=document.getElementById('contactContai');
                contactContai.appendChild(channelBox);
                channelForm.classList.add('dsn');
                resolve();
            }).then(()=>{
                document.getElementById('endOfCreateChannel').classList.remove('dsn');
                level1.style.width="100%";
                level2.style.width="0";
                channelName.value="";
                channelDescription.value="";
                channelPicture.value="";
                document.querySelector('#channelPictureL').style.backgroundImage="";
            })
        }
        http.open('post','/createChannel');
        http.send(formdata);
    })
})

channelDisc.addEventListener('keyup',()=>{
    wordNum.querySelector('.cgray').innerHTML=`${channelDisc.value.length}/50`;
    if(50<channelDisc.value.length){
        wordNum.querySelector('.cr').classList.remove('dsn');
    }else{
        wordNum.querySelector('.cr').classList.add('dsn');
    }
})

channelPicture.addEventListener('change',()=>{
    var file=channelPicture.files[0];

    var imgSrc=URL.createObjectURL(file);
    document.querySelector('#channelPictureL').style.backgroundImage=`url(${imgSrc})`;
    
    var fileName=file.name;
    var type=fileName.split('.').reverse()[0];
    if(!((type==="jpg")||(type==="jpeg")||(type==="png"))){
        var pa=document.querySelector('.m-auto');
        pa.classList.remove('dsn');
    }else{
        var pa=document.querySelector('.m-auto');
        pa.classList.add('dsn');
    }
})

channelNamespace.on('message',data=>{
    if(Number(notificationObject[data.channelID])){
        messageMusic();
    }
    if(channels[data.channelID]===undefined){
        new Promise(resolve=>{
            var formdata=new FormData();
            formdata.append('channelID',data.channelID);

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
                resolve()
            }
            http.open('post','/newChannel')
            http.send(formdata)
        }).then(()=>{
            var x=Number(channels[data.channelID]);
            sliceMsg('channelMessage',data.message,x);
    
            switch(nowChannel.channelID){
                case data.channelID:
                    if((data.username!==username)&&channelActive){
                        recieve(data.message,data.date)
                    }
    
                    channelNamespace.emit('seen-message',{
                        username:username,
                        channelID:data.channelID
                    })
                    break;
                case undefined:
                    changeMsgNumberAndLastChat('channelMessage',x,data.message);
                    break;
                default:
                    changeMsgNumberAndLastChat('channelMessage',x,data.message);
                    break;
            }
        })
    }else{
        var x=Number(channels[data.channelID]);
        sliceMsg('channelMessage',data.message,x);

        switch(nowChannel.channelID){
            case data.channelID:
                if((data.username!==username)&&channelActive){
                    recieve(data.message,data.date)
                }

                channelNamespace.emit('seen-message',{
                    username:username,
                    channelID:data.channelID
                })
                break;
            case undefined:
                changeMsgNumberAndLastChat('channelMessage',x,data.message);
                break;
            default:
                changeMsgNumberAndLastChat('channelMessage',x,data.message);
                break;
        }
    }
})

channelNamespace.on('recieve-file',data=>{
    console.log(data);
})