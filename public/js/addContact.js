var addContact=document.getElementById('addContact');
var newMessage=document.querySelector('.newMessage');
var leftCol=document.querySelector('.left-col');

var addContactForm=document.getElementById('addContactForm');
var addContactInput=document.querySelectorAll('.addContactInput');
var before=null;

/* active after click on contacts in menu */
addContact.addEventListener('click',()=>{
    addContactTag();

    if(768<=document.body.scrollWidth){
        rightCol[1].classList.remove('dsn');
        if(!newMessage.classList.contains('dsn')){
            before=newMessage;
            newMessage.classList.add('dsn');
        }else{
            before=rightCol[0];
            rightCol[0].classList.add('dsn');
        }
    }else{
        leftCol.classList.add('dsn');
        menuContent.classList.add('dsn');

        rightCol[1].classList.remove('dsn');
    }
})

/* this is the zarb on the add contact page */
removeAddContact=()=>{
    addContactInput.forEach(input=>{
        input.value="";
        response.classList.add('dsn');
    });

    rightCol[1].classList.add('dsn');
    if(768<=document.body.scrollWidth){
        if(before.classList.contains('right-col')){
            rightCol[0].classList.remove('dsn');
            newMessage.classList.add('dsn');
        }else{
            rightCol[0].classList.add('dsn');
            newMessage.classList.remove('dsn');
        }
    }else{
        leftCol.classList.remove('dsn');
        menuContent.classList.remove('dsn');
        var rc=menuContent.classList.value.split(' ')[1];
        menuContent.classList.remove(rc)
    }
}
addContactInput.forEach(input=>{
    input.addEventListener('keypress',()=>{
        response.classList.add('dsn');
    })
});

addContactFormFunction=(e,addContactInput,response)=>{
    e.preventDefault();
    var formdata=new FormData();
    formdata.append('name',addContactInput[0].value);
    formdata.append('family',addContactInput[1].value);
    formdata.append('phoneNumber',addContactInput[2].value);
    formdata.append('username',username);

    var http=new XMLHttpRequest();
    http.onloadend=e=>{
        response.classList.remove('dsn');
        addContactInput.forEach(input=>{
            input.value="";
        })
        var res=Number(e.target.responseText);
        switch(res){
            case 0:
                response.classList.remove('cgold')
                response.classList.remove('cgreen')
                response.classList.add('cr');
                response.innerHTML='user not exist!';
                break;
            case 2:
                response.classList.remove('cgreen')
                response.classList.remove('cr')
                response.classList.add('cgold');
                response.innerHTML='you have this user in your contacts!';
                break;
            default:
                response.classList.add('cgreen')
                response.classList.remove('cr')
                response.classList.remove('cgold');
                response.innerHTML='the user added to your contact!';

                var addContact=JSON.parse(e.target.responseText)[0];
                myContacts[addContact.contactName]=Object.keys(myContacts).length;
                notificationObject[addContact.contactName]=1;
    
                var chatBox=createContact('contact',addContact)
                chatBox.addEventListener('click',()=>{
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
                    sendMessege(username,user.contactName,chatBox)
                });
                var contactContai=document.getElementById('contactContai');
                contactContai.appendChild(chatBox)
                break;
        }
    }
    http.open('post','/addContact');
    http.send(formdata);
}