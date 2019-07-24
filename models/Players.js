const mongoose=require('mongoose');
const bcryprt = require('bcryptjs');
const passport = require('passport');

const PlayerSchema=new mongoose.Schema({
    pname:{
        type:String,
        required:true
    }, country:{
        type:String,
        required:true
    }, sports:{
        type:String,
        required:true
    }, link:{
        type:String,
        required:true
    }
});

const Player=mongoose.model('Player',PlayerSchema,'players');

module.exports = Player;