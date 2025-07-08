
const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('crypto'); // for hashing

const {createToken} = require('../services/auth');

const userSchema = new mongoose.Schema({
    fullName :{
        type:String,
        required :true
    },
    email :{
        type:String,
        required:true,
        unique:true,
    },
     salt: {   // for hashing purpose
        type:String,
    },
    password: {
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum :['USER','ADMIN'], // means apart from these no other value can be their
        required:true,
        default:"USER",
    },
     profileImg:{
        type:String,
         default: "/default.webp"
    }
},{timestamps:true});

userSchema.pre('save',function (next){
    const user = this;
    if(!user.isModified('password')) {
        console.log("No password");
        return;}
    
    const salt = randomBytes(16).toString();
    const hashedPasswd = createHmac('sha256',salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPasswd;

    next();
});

userSchema.static('matchPassword',async function(email,password){
    const user =  await User.findOne({email});
    if(!user) throw new Error('User not found') ;

    const salt= user.salt;

    const hashedPasswd = user.password;
    const providedPasswd = createHmac('sha256',salt)
    .update(password).digest('hex');


    if(hashedPasswd !== providedPasswd) throw new Error('Incorrect Password') ;

    const token = createToken(user);
    return token;

});

const User = mongoose.model("user",userSchema);

module.exports = User;