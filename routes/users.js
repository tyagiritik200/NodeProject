const express=require("express");
const router=express.Router();
var path=require("path");

//Login Page
var pl=path.join(__dirname,"../","Login.html");
router.get('/login',(req,res) => res.status(200).sendfile(pl));

//Register Page
var pr=path.join(__dirname,"../","SignUp.html");
router.get('/register',(req,res) => res.status(200).sendFile(pr));

module.exports=router;