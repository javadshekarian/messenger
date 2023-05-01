saveMessageOption.addEventListener('click',()=>{
    querySaveMessage(username)

    userInformation(username)

    mainForm.classList.remove('dsn');
    saveMessageForm.classList.add('dsn');
    
    document.querySelector('.chat-section').classList.remove('dsn');
    newMessage.classList.add('dsn');

    if(768<=document.body.scrollWidth){
        rightCol[0].classList.remove('dsn');
        newMessage.classList.add('dsn');
    }else{
        document.querySelector('.left-col').classList.add('dsn');
        arrowLeft.classList.add('dsn');
        document.querySelector('.right-col').classList.remove('dsn');
        arrowLeft.classList.remove('dsn');
    }

    chatBox.innerHTML=""
})

saveForm.addEventListener('submit',e=>{
    e.preventDefault();

    var date=`${new Date().getHours()}:${new Date().getMinutes()}`;
    var messageContent=saveForm.querySelector('input').value;

    var formdata=new FormData();
    formdata.append('username',username);
    formdata.append('message',messageContent);
    formdata.append('type','txt');
    formdata.append('date',date);

    var http=new XMLHttpRequest();
    http.onloadend=e=>{
        var feedback=Number(e.target.responseText);
        if(feedback){
            send(messageContent,date);
            saveForm.querySelector('input').value="";
        }
    }
    http.open('post','/saveMessage');
    http.send(formdata);
});