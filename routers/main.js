var {Router}=require('express');

const router=new Router()

router.get('/',(req,res)=>{
    res.render('body',{});
})

router.get('/register',(req,res)=>{
    res.render('register',{})
})

router.get('/addContact',(req,res)=>{
    res.render('addContact',{})
})

router.get('/login',(req,res)=>{
    res.render('login',{})
})

module.exports.router=router;