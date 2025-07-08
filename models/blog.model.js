const {Schema , mongoose} = require('mongoose');

const blogSchema = new Schema({
title :{
        type:String,
        required :true
    },
    body :{
        type:String,
        required:true,
    },
     coverImage: {   // for hashing purpose
        type:String,
    },
    createdBy: {
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
   
},{timestamps:true});

const Blog = mongoose.model('Blog',blogSchema);


module.exports =Blog;