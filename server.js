const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');
const dotenv=require('dotenv');
const upload=require('express-fileupload');
const socket=require('socket.io');
const bcrypt=require('bcrypt');

dotenv.config({path:'./config/config.env'});

const {connection}=require('./config/connection');

const app=express();

/* statics */
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"uploads","files")));
app.use(express.static(path.join(__dirname,"uploads","profilePicture")));
app.use(express.static(path.join(__dirname,"uploads","channelPicture")));
app.use(express.static(path.join(__dirname,"uploads","groupPicture")));
/* end of statics */

app.use(bodyParser.urlencoded({extended:false}));
app.use(upload());

app.use(require('./routers/main').router);
app.use(require('./controller/postRouts').postRouts);
app.use(require('./controller/upload').uploadRouter);
app.use(require('./controller/channel').channel);
app.use(require('./controller/group').group)

app.set('view engine','ejs');

const io=socket(
    app.listen(3000,()=>{
        console.log(`the app is listen to port ${process.env.PORT}!`);
    })
);

/* set middelware for io */
require('./functions/socketMiddelware').check(io.of("/channel"));
require('./functions/socketMiddelwareGroup').check(io.of("/group"));
/* end of set */

/* starting socket server in root namespace */
require('./controller/chat').start(io);
/* end of starting server */

/* starting channel socket server in channel namespace */
require('./controller/channel.io').start(io.of("/channel"));
/* end of starting */

/* starting socket server in group namespace */
require('./controller/group.io').start(io.of("/group"));
/* end of starting */