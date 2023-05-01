groupNamespace.on('connect',()=>{
    groupNamespace.emit('online',{
        socketID:socket.id,
        username
    })
})

groupNamespace.on("disconnect", () => {
    groupNamespace.emit('dis',{})
});

var level1Group=document.getElementById('level1group');
var level2Group=document.getElementById('level2group');
var gLevel2Group=document.getElementById('gLevel2group');
var leftLevel1Group=document.getElementById('leftLevel1group');
var allContactBoxGroup=document.querySelector('.allContactBoxGroup');
var groupForm=document.getElementById('groupForm');
var groupDisc=document.getElementById('groupDiscription');
var wordNumGroup=document.getElementById('wordNumGroup');
var groupContainer=document.getElementById('groupContainer');
var backToMenuGroup=document.getElementById('backToMenuGroup');

var groupName=document.getElementById('groupName');
var groupDescription=document.getElementById('groupDiscription');

var createGroup=document.getElementById('createGroup');
// var menuAndContactsContainer=document.getElementById('menuAndContactsContainer');
var groupPicture=document.getElementById('groupPicture');

var selectedContactsForGroup=new Object();

groupNamespace.on('message',data=>{
    if(Number(notificationObject[data.groupID])){
        messageMusic();
    }
    if(groups[data.groupID]===undefined){
        new Promise(resolve=>{
            var formdata=new FormData();
            formdata.append('groupID',data.groupID);

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
                resolve()
            }
            http.open('post','/newGroup')
            http.send(formdata)
        }).then(()=>{
            var x=Number(groups[data.groupID]);
            sliceMsg('groupMessage',data.message,x);

            switch(nowGroup.groupID){
                case data.groupID:
                    if((data.username!==username)&&groupActive){
                        recieve(data.message,data.date)
                    }

                    groupNamespace.emit('seen-message',{
                        username:username,
                        groupID:data.groupID
                    })
                    break;
                case undefined:
                    changeMsgNumberAndLastChat('groupMessage',x,data.message);
                    break;
                default:
                    changeMsgNumberAndLastChat('groupMessage',x,data.message);
                    break;
            }
        })
    }else{
        var x=Number(groups[data.groupID]);
        sliceMsg('groupMessage',data.message,x);

        switch(nowGroup.groupID){
            case data.groupID:
                if((data.username!==username)&&groupActive){
                    recieve(data.message,data.date)
                }

                groupNamespace.emit('seen-message',{
                    username:username,
                    groupID:data.groupID
                })
                break;
            case undefined:
                changeMsgNumberAndLastChat('groupMessage',x,data.message);
                break;
            default:
                changeMsgNumberAndLastChat('groupMessage',x,data.message);
                break;
        }
    }
})

groupForm.addEventListener('submit',e=>{
    e.preventDefault();
    userJustInformation(username)
    .then(info=>{
        var file=groupPicture.files[0];

        var formdata=new FormData();
        formdata.append('groupMember',JSON.stringify(Object.values(selectedContactsForGroup)));
        formdata.append('groupName',groupName.value);
        formdata.append('groupDescription',groupDescription.value);
        formdata.append('username',username);
        formdata.append('accountInformation',JSON.stringify(Object.values(info)));
        formdata.append('groupPicture',file)

        var http=new XMLHttpRequest();
        http.onloadend=e=>{
            new Promise(resolve=>{
                var AllInfo=JSON.parse(e.target.responseText)
                var group=AllInfo.group;
                var groupMember=AllInfo.selectedContacts;

                groupNamespace.emit('create-group',{
                    groupID:group.groupID,
                    groupMember:groupMember
                })

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
                groupForm.classList.add('dsn');
                resolve();
            }).then(()=>{
                document.getElementById('endOfCreateGroup').classList.remove('dsn');
                level1Group.style.width="100%";
                level2Group.style.width="0";
                groupName.value="";
                groupDescription.value="";
                groupPicture.value="";
                document.querySelector('#groupPictureL').style.backgroundImage="";
            })
        }
        http.open('post','/createGroup');
        http.send(formdata);
    })
})

createGroup.addEventListener('click',()=>{
    document.getElementById('endOfCreateGroup').classList.add('dsn');
    groupForm.classList.remove('dsn');

    var formdata=new FormData();
    formdata.append('username',username);

    var http=new XMLHttpRequest();
    http.onloadend=e=>{
        var contacts=JSON.parse(e.target.responseText);
        createContactForCreateGroup(contacts.length,contacts);
    }
    http.open('post','/username');
    http.send(formdata);

    menuAndContactsContainer.classList.add('dsn');
    groupContainer.classList.remove('dsn');
    var classNames=['w20vw','w30vw','w70vw'];
    classNames.forEach(className=>{
        if(menuContent.classList.contains(className)){
            menuContent.classList.remove(className);
        };
    });
    menuContent.classList.add('dsn');
})

groupDisc.addEventListener('keyup',()=>{
    wordNumGroup.querySelector('.cgray').innerHTML=`${groupDisc.value.length}/50`;
    if(50<groupDisc.value.length){
        wordNumGroup.querySelector('.cr').classList.remove('dsn');
    }else{
        wordNumGroup.querySelector('.cr').classList.add('dsn');
    }
})

groupPicture.addEventListener('change',()=>{
    var file=groupPicture.files[0];

    var imgSrc=URL.createObjectURL(file);
    document.querySelector('#groupPictureL').style.backgroundImage=`url(${imgSrc})`;
    
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

createContactForCreateGroup=(arrayLength,contacts)=>{
    allContactBoxGroup.innerHTML="";
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

            var groupMember=new Object();
            groupMember.username=contacts[item].contactName;
            groupMember.phoneNumber=contacts[item].contactPhone;

            if(div.querySelector('.greenSelect').classList.contains('fillCir')){
                div.querySelector('.greenSelect').classList.remove('fillCir');
                div.classList.remove('setSelectStyle');
                delete selectedContactsForGroup[item];
            }else{
                div.querySelector('.greenSelect').classList.add('fillCir');
                div.classList.add('setSelectStyle');
                selectedContactsForGroup[contactID]=groupMember;
            };
        });
        allContactBoxGroup.appendChild(div);
    })
};

backToMenuGroup.addEventListener('click',()=>{
    menuAndContactsContainer.classList.remove('dsn');
    groupContainer.classList.add('dsn');
    menuContent.classList.remove('dsn');
})

gLevel2Group.addEventListener('click',()=>{
    level1Group.style.width="0";
    level2Group.style.width="100%";
});
leftLevel1Group.addEventListener('click',e=>{
    e.target.classList.remove('dsn');
    level1Group.style.width="100%";
    level2Group.style.width="0";
});

groupNamespace.on('recieve-file',data=>{
    const fileName=data.fileRealName;
    const fileTemp=fileName.split('.').reverse()[0];

    if(data.sender!==username){
        reciveFile(fileTemp,data.fileName,data.fileRealName,date())
    }
})