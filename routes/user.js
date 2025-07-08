const {Router} = require('express');
const User = require('../models/user.model');
const router = Router();


router.get('/signin',(req,res)=>{
    return res.render('signin');
});

router.get('/login',(req,res)=>{
    return res.render('login');
});

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;
  try{const token = await  User.matchPassword(email,password);

    return res.cookie('token',token).redirect('/');}
    catch(error){
        return res.render('login',{
            error :'Incorrect email or password',
        })
    }
})

router.post('/signin',async (req,res)=>{
    
    const {fullName,email,password} = req.body;

    await User.create({
        fullName,email,password
    });

    return res.redirect('/');
});

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/');
})

module.exports = router;