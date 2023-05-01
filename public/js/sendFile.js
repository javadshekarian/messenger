const undo=document.querySelector('.undo');
var microphone=document.querySelector('.fa-microphone');
var file=document.querySelector('.fa-paperclip');
var fileContent=document.getElementById('fileContent')
var fileInput=document.querySelector('input[type="file"]')
var sendFileForm=document.getElementById('sendFileForm')

undo.addEventListener('click',()=>{
    undo.style.opacity="0";
    fileContent.value="";
    fileContentFunctionR();
    setTimeout(()=>{
        undo.style.display="none";
    },500)
})

microphone.addEventListener('click',e=>{
    /* record voice function! */
    console.log('record voice');
});

fileContent.addEventListener('change',()=>{
    var selectFile=fileContent.files[0];

    undo.style.display="flex";
    undo.style.opacity="1";

    if(20<=selectFile.name.length){
        fileContentFunction(selectFile.name.slice(0,20)+' ...');
    }else{
        fileContentFunction(selectFile.name);
    }
});

sendFileForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    var active=new Object();
    active.groupActive=groupActive;
    active.channelActive=channelActive;
    active.contactActive=contactActive;

    active=swapObj(active);

    var sendFile=fileContent.files[0];

    var formdata=new FormData();
    formdata.append('username',username);
    formdata.append('date',date());
    formdata.append('type',sendFile.name.split('.').reverse()[0]);
    formdata.append('fileName',sendFile.name);
    formdata.append('sender',username);
    formdata.append('sendFile',sendFile);

    var http=new XMLHttpRequest();
    
    switch(active[true]){
        case 'contactActive':
            formdata.append('reciever',recieverInfo.name);
            http.onloadend=e=>{
                var fileName=e.target.responseText;
                var fileTemp=fileName.split('.').reverse()[0];
                
                sendFileFunction(fileTemp,fileName,sendFile.name,date())

                socket.emit('send-file',{
                    reciever:recieverInfo.name,
                    sender:username,
                    fileName:fileName,
                    fileRealName:sendFile.name,
                    date:date()
                })
                fileContentFunctionR();
                undo.style.opacity="0";
                setTimeout(()=>{
                    undo.style.display="none";
                },500)
            }
            http.open('post','/sendFile');
            break;
        case 'channelActive':
            formdata.append('channelID',nowChannel.channelID);
            http.onloadend=e=>{
                var fileName=e.target.responseText;
                var fileTemp=fileName.split('.').reverse()[0];
                
                sendFileFunction(fileTemp,fileName,sendFile.name,date())

                channelNamespace.emit('send-file',{
                    channelID:nowChannel.channelID,
                    sender:username,
                    fileName:fileName,
                    fileRealName:sendFile.name,
                    date:date()
                })
                fileContentFunctionR();
                undo.style.opacity="0";
                setTimeout(()=>{
                    undo.style.display="none";
                },500)
            }
            http.open('post','/sendFileChannel');
            break;
        case 'groupActive':
            formdata.append('groupID',nowGroup.groupID);
            http.onloadend=e=>{
                var fileName=e.target.responseText;
                var fileTemp=fileName.split('.').reverse()[0];

                sendFileFunction(fileTemp,fileName,sendFile.name,date())

                groupNamespace.emit('send-file',{
                    groupID:nowGroup.groupID,
                    sender:username,
                    fileName:fileName,
                    fileRealName:sendFile.name,
                    date:date()
                })
                fileContentFunctionR();
                undo.style.opacity="0";
                setTimeout(()=>{
                    undo.style.display="none";
                },500)
            }
            http.open('post','/sendFileGroup');
            break;
    };

    http.send(formdata);
})