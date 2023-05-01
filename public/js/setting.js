var bychatSetting=document.getElementById('bychatSetting');
var backToHomeS=document.getElementById('backToHomeS');
var settingContainer=document.getElementById('settingContainer');

bychatSetting.addEventListener('click',()=>{
    document.getElementById('endOfCreateChannel').classList.add('dsn');
    settingContainer.classList.remove('dsn');

    menuAndContactsContainer.classList.add('dsn');

    var classNames=['w20vw','w30vw','w70vw'];
    classNames.forEach(className=>{
        if(menuContent.classList.contains(className)){
            menuContent.classList.remove(className);
        };
    });
    menuContent.classList.add('dsn');
})

backToHomeS.addEventListener('click',()=>{
    menuAndContactsContainer.classList.remove('dsn');
    settingContainer.classList.add('dsn');
    menuContent.classList.remove('dsn');
})
