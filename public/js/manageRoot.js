var myAccountInformation=new Object();
window.onload=()=>{
    var manageRoot=document.cookie.split('=')[1];
    if(manageRoot===undefined){
        location.replace('/register');
    }else{
        var formdata=new FormData();
        formdata.append('username',document.cookie.split('=')[1]);
        var http=new XMLHttpRequest();
        http.onloadend=e=>{
            var res=Number(JSON.parse(e.target.responseText));
            if(!res){
                location.replace('/register')
            }else{
                var formdata=new FormData();
                formdata.append('user',document.cookie.split('=')[1]);

                var http=new XMLHttpRequest();
                http.onloadend=e=>{
                    myAccountInformation=JSON.parse(e.target.responseText)[0]
                }
                http.open('post','/userInformation');
                http.send(formdata)
            }
        }
        http.open('post','/red');
        http.send(formdata);
    }
}