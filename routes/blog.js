const {Router} = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog.model');
const Comment = require('../models/comment.model')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, file.fieldname + uniqueSuffix);
  }
})

const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user:req.user
    });
});

router.get('/login',(req,res)=>{
    return res.render('login');
});

router.post('/',upload.single('coverImg'),async (req,res)=>{
  const {title,body} = req.body;
   const blog = await Blog.create({
    body,title,
    createdBy : req.user._id,
    coverImage : `/uploads/${req.file.filename}`
   })
    return res.redirect(`/blog/${blog._id}`);
});

router.get('/:id',upload.single('coverImg'),async (req,res)=>{
   const blog = await Blog.findById(req.params.id).populate('createdBy');
   const comments  = await Comment.find({blogId:req.params.id}).populate('createdBy');
   console.log(blog.createdBy);

   if(!blog) return ;
    return res.render('blog',{
      user:req.user,
      blog,
      comments
    });
});

router.post('/comment/:id',async (req,res)=>{
 console.log(req);
  await Comment.create({
    content :req.body.content,
    createdBy : req.user._id,
    blogId : req.params.id,
   })
    return res.redirect(`/blog/${req.params.id}`);
});

module.exports = router;