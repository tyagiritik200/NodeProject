const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/Users');
const config=require('./Keys');
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');

module.exports=function(passport){
    passport.serializeUser(function(user,done){
        done(null,user);
    })

    passport.deserializeUser(function(user,done){
        //User.findById(id,function(err,user){
            done(null,user);
       // })
    })
    passport.use(new LocalStrategy({ usernameField: 'uname',passwordField:'pass' },function(uname,pass,done){
        User.findOne({uname:uname},function(err,doc){
            if(err) {done(err)}
            else{
                if(doc){
                    var valid=doc.comparePassword(pass,doc.pass)
                    if(valid){
                       done(null,{
                           uname: doc.uname,
                           pass: doc.pass,
                           email: doc.email,
                           phno : doc.phno
                       })
                    }else{
                        done(null,false)
                    }

                }else{
                    done(null,false)
                }
            }
        })
    }))






    /*//Local strategy
    passport.use(new LocalStrategy(function(uname,pass,done){
        //Match Username
        let query={uname:uname};
        console.log(query);
        User.findOne(query,function(err,user){
            if(err) throw err;
            if(!user){
                console.log("That username is not registered");
                return done(null,false,{message:'No user found'});
            }

            //Match Password
            bcrypt.compare(pass,user.pass,function(err,isMatch){
                if(err) throw err;
                if(isMatch){
                    console.log("That username is registered");
                    return done(null,user);
                }else{
                    console.log("Incorrect Password");
                    return done(null,false,{message:'Incorrect Password'});
                }

            });
        });

    }));
    passport.serializeUser(function(user,done){
        done(null,user.id);
    })

    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        })
    })*/

}
















/*const LocalStrategy = require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
//Load User Model
const User=require('../models/Users');
console.log("Inside Passport");
module.exports=function(passport){
    console.log("Inside module");
    passport.use(
        new LocalStrategy({ usernameField: 'uname' },(uname,pass,done)=>{
            console.log("Inside LocalStrategy");
            //Match User
            User.findOne({uname:uname})
            .then(user=>{
                if(!user){
                    console.log("That username is not registered");
                    return done(null,false,{message:'That username is not registered'});
                }
                //Match Password
                bcrypt.compare(pass,user.pass,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        console.log("That username is registered");
                        return done(null,user);
                    }
                    else{
                        console.log("Incorrect Password");
                        return done(null,false,{message:'Incorrect Password'});
                    }

                });
            })
            .catch(err=>console.log(err));
        })
    );

    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user);
        });
    });
}*/