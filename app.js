require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require ('cookie-parser')
const Blog = require('./models/blog.model')

const app = express();
const PORT = process.env.PORT || 8000;
const userRoute = require('./routes/user');
const blogRoute =require('./routes/blog');
const { checkForAuthCookie } = require('./middlewares/auth');


mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("MongoDB Connected!")});

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(express.static(path.resolve('./public'))) // for loading the image we have to tell our express that this path can be statically served
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthCookie('token'));

const User = require('./models/user.model');
app.use(async (req, res, next) => {
  if (req.user && req.user._id) {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        res.locals.user = user;
        req.user = user;
      }
    } catch (e) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render('home',{
        user :req.user,
        blogs : allBlogs
    });
})

app.use('/user',userRoute);
app.use('/blog',blogRoute)
app.listen(PORT,()=>{
    console.log("Server started at ",PORT);
})

