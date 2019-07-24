const mongoose=require('mongoose');
const bcryprt = require('bcryptjs');
const passport = require('passport');

const UserSchema=new mongoose.Schema({
    uname:{
        type:String,
        required:true
    }, phno:{
        type:Number,
        required:true
    }, email:{
        type:String,
        required:true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    
    pass:{
        type:String,
        required:true
    }, date:{
        type:Date,
        default:Date.now
    }

});

UserSchema.methods.comparePassword=function(pass,hash){
    return bcryprt.compareSync(pass,hash)
}

const User=mongoose.model('User',UserSchema,'users');

module.exports = User;