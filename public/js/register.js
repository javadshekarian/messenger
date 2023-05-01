var createAccount=document.getElementById('createAccount');
var inputs=document.querySelectorAll('input')

var page1=document.getElementById('page1');
var page2=document.getElementById('page2');
var page3=document.getElementById('page3');
var next=document.querySelector('.next');
var sbmt=document.querySelector('button[type="submit"]');
var nf=document.getElementById('nf');
var back=document.getElementById('back');
var loginT=document.getElementById('loginT');
var createAccount=document.getElementById('createAccount');
var goC=document.getElementById('goC');
var login=document.getElementById('login');
var passwords=page2.querySelectorAll('input');
var locks=page2.querySelectorAll('.fa-lock')

passwords[0].addEventListener('keypress',()=>{
    passwords[0].style.borderBottom="1px solid lightgray";
    locks[0].style.borderBottom="1px solid lightgray";
})
passwords[1].addEventListener('keypress',()=>{
    passwords[1].style.borderBottom="1px solid lightgray";
    locks[1].style.borderBottom="1px solid lightgray";
})

next.addEventListener('click',()=>{
    if((getComputedStyle(page2).width==="0px")&&(getComputedStyle(page1).width==="310px")){
        if(!(inputs[0].value&&inputs[1].value&&inputs[2].value&&inputs[3].value)){
            document.querySelectorAll('input[type="text"]').forEach(input=>{
                if(!input.value){
                    input.style.borderBottom="1px solid red";
                    input.parentNode.querySelector('i').style.borderBottom="1px solid red";
                }
            })
        }else{
            page1.style.width="0px";
            page2.style.width="300px";
            back.classList.remove('dsn');
        }
    }else{
        if(passwords[0].value !== passwords[1].value){
            document.querySelector('.ip').classList.remove('dsn')
            passwords.forEach(password=>{
                password.style.borderBottom="1px solid red";
                password.value=""
            })
            locks.forEach(lock=>{
                lock.style.borderBottom="1px solid red";
            })
        }else{
            document.querySelector('.ip').classList.add('dsn')
            page2.style.width="0px";
            page3.style.width="300px";
            next.setAttribute('style','display:none !important;');
            sbmt.setAttribute('style','display:inline-block;');
        }
    }
})
back.addEventListener('click',()=>{
    if(getComputedStyle(page2).width==="0px"){
        page2.style.width="300px";
        next.setAttribute('style','display:flex !important;');
        sbmt.setAttribute('style','display:none;');
        page3.style.width="0px";
    }else{
        page1.style.width="320px";
        page2.style.width="0px";
        back.classList.add('dsn');
    }
})


loginT.addEventListener('click',()=>{
    createAccount.classList.add('dsn');
    login.classList.remove('dsn');
})
goC.addEventListener('click',()=>{
    createAccount.classList.remove('dsn');
    login.classList.add('dsn');
})

createAccount.addEventListener('submit',e=>{
    e.preventDefault();
    var file=inputs[6].files[0];
    var fileName=file.name;
    var type=fileName.split('.').reverse()[0];
    if((type==="jpg")||(type==="jpeg")||(type==="png")){
        var formdata=new FormData();
        formdata.append('name',inputs[0].value);
        formdata.append('family',inputs[1].value);
        formdata.append('username',inputs[2].value);
        formdata.append('phoneNumber',inputs[3].value);
        formdata.append('password',inputs[4].value);
        formdata.append('file',inputs[6].files[0]);

        var http=new XMLHttpRequest();
        http.onloadend=e=>{
            var username=e.target.responseText;
            new Promise(resolve=>{
            var date=new Date(new Date().getTime()+1000*60*60*24*365).toGMTString();
            document.cookie = `username=${username}; expires=${date}; path=/`;
            resolve()
        }).then(()=>{
            location.replace('/')
        })
        }
        http.open('post','/register');
        http.send(formdata);
    }
})
inputs.forEach(input=>{
    input.addEventListener('keypress',()=>{
        input.style.borderBottom="1px solid lightgray";
        input.parentNode.querySelector('i').style.borderBottom="1px solid lightgray";
    })
})

inputs[6].addEventListener('change',()=>{
    var file=inputs[6].files[0];

    var imgSrc=URL.createObjectURL(file);
    document.querySelector('label').style.backgroundImage=`url(${imgSrc})`;
    
    var fileName=file.name;
    var type=fileName.split('.').reverse()[0];
    if(!((type==="jpg")||(type==="jpeg")||(type==="png"))){
        var pa=page3.querySelector('.pa');
        pa.classList.remove('dsn');
    }else{
        var pa=page3.querySelector('.pa');
        pa.classList.add('dsn');
    }
})

var linputs=login.querySelectorAll('input');
var inc=document.querySelectorAll('.inc');

linputs[0].addEventListener('keypress',()=>{
    inc[0].classList.add('dsn');
})
linputs[1].addEventListener('keypress',()=>{
    inc[1].classList.add('dsn');
})
lif=()=>{
    linputs.forEach(input=>{
        input.value="";
    })
}

login.addEventListener('submit',e=>{
    e.preventDefault();
    
    var formdata=new FormData();
    formdata.append('username',linputs[0].value);
    formdata.append('password',linputs[1].value);

    var http=new XMLHttpRequest();
    http.onloadend=e=>{
        var res=Number(e.target.responseText);
        switch(res){
            case 0:
                new Promise(resolve=>{
                    var date=new Date(new Date().getTime()+1000*60*60*24*365).toGMTString();
                    document.cookie = `username=${linputs[0].value}; expires=${date}; path=/`;
                    resolve()
                }).then(()=>{
                    location.replace('/')
                })
                break;
            case 1:
                inc[1].classList.remove('dsn');
                lif();
               break;
            case 2:
                inc[0].classList.remove('dsn');
                inc[1].classList.remove('dsn');
                lif();
        }
    }
    http.open('post','/login');
    http.send(formdata);
})