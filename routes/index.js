const express = require("express");
const router = express.Router();
var path = require("path");
const bcryprt = require('bcryptjs');
const passport = require('passport');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
//User Model
const User = require('../models/Users');
const Player = require('../models/Players');
const assert = require("assert");

//DB Config
const url = require('../config/Keys').MongoURI;

var loggedin = function (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/Login.ejs')
    }
}

//var ph=path.join(__dirname,"../","Homepage.html");
router.get('/', (req, res, next) => res.render("Homepage"));

//Login Page
//var pl=path.join(__dirname,"../","Login.html");
router.get('/Login.ejs', (req, res, next) => res.render("Login"));


//Register Page
//var pr=path.join(__dirname,"../","SignUp.html");
router.get('/SignUp.ejs', (req, res) => res.render("SignUp"));

//MainPage
router.get('/MainPage', loggedin, (req, res) => res.render("MainPage"));

//ViewProfile
router.get('/ViewProfile', loggedin, (req, res) => res.render("ViewProfile", {
    uname: req.user.uname,
    pass: req.user.pass,
    phno: req.user.phno,
    email: req.user.email
}));



//Register Handle
router.post('/SignUp.ejs', (req, res) => {
    const { uname, phno, email, pass } = req.body;
    let errors = [];

    //Check required Fields
    if (!uname || !phno || !email || !pass) {
        errors.push({ msg: "Please fill in all fields" });
    }

    if (errors.length > 0) {
        res.render("SignUp", {
            errors,
            uname,
            phno,
            email,
            pass
        });
    } else {
        // Validation Passed
        User.findOne({ uname: uname })
            .then(user => {
                if (user) {
                    //User exists
                    errors.push({ msg: 'Username already exists' });
                    //JSAlert.alert("Your files have been saved successfully.", "Files Saved", "Got it");
                    res.render("SignUp", {
                        errors,
                        uname,
                        phno,
                        email,
                        pass
                    });
                } else {
                    const newUser = new User({
                        uname,
                        phno,
                        email,
                        pass
                    });
                    //Hash Password
                    bcryprt.genSalt(10, (err, salt) =>
                        bcryprt.hash(newUser.pass, salt, (err, hash) => {
                            if (err) throw err;
                            //Set password to hashed
                            newUser.pass = hash;
                            console.log(newUser);
                            //Save user
                            newUser.save()
                                .then(user => {
                                    res.redirect('/Login.ejs');
                                })
                                .catch(err => console.log(err));
                        })
                    )

                    // res.send("Hello");
                }
            });
    }
    /*console.log(req.body)
      res.send('Hello');*/
});

//Login Handle

router.post('/Login.ejs', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/MainPage',
        failureRedirect: '/Login.ejs',
    })(req, res, next);
})

//LogOut Handle

router.get('/Logout', function (req, res) {
    req.logOut()
    res.redirect('/Login.ejs')
})


//UsersInfo
router.get('/UsersInfo', loggedin, function (req, res) {
    User.find({}, function (err, users) {
        if (err) throw err;
        var UsersArray = [];
        users.forEach(function (doc, err) {
            UsersArray.push(doc);
        })
        res.render('UsersInfo', { items: users });
    });
});


//PlayersInfo
router.get('/PlayersInfo', loggedin, function (req, res) {
    Player.find({}, function (err, players) {
        if (err) throw err;
        var PlayersArray = [];
        players.forEach(function (doc, err) {
            //console.log("Hello");
            //if(err) throw err;
            PlayersArray.push(doc);
        })
        //console.log(PlayersArray);
        res.render('PlayersInfo', { items: players });
    });
});

//Change Password
router.get('/ChangePass', loggedin, (req, res) => res.render("ChangePass"));

//Password Handle
router.post('/ChangePass', function (req, res, next) {
    var item = {
        uname: req.body.uname,
        oldpass: req.body.oldpass,
        newpass: req.body.newpass
    };
    User.findOne({ uname: item.uname })
        .then(exist => {
            if (exist) {
                var valid = exist.comparePassword(item.oldpass, exist.pass);
                if (valid) {
                    //Hash Password
                    bcryprt.genSalt(10, (err, salt) =>
                        bcryprt.hash(item.newpass, salt, (err, hash) => {
                            if (err) throw err;
                            //Set password to hashed
                            item.newpass = hash;
                            User.updateOne({ uname: item.uname }, { $set: { pass: item.newpass } }, function (err, users) {
                                if (err) throw err;
                                console.log("Password Changed");
                                res.redirect('/MainPage');
                            })
                        })

                    )

                } else {
                    console.log("Old Password Incorrect");
                    res.redirect('/ChangePass');
                }
            } else {
                console.log("Username Incorrect");
                res.redirect('/ChangePass');
            }
        })
})

//Search Players

router.get('/NotFound', loggedin, (req, res) => (res.render('NotFound')));

router.post('/SearchPlayers', function (req, res, next) {
    var searchplayer = req.body.plname;
    Player.find({ pname: { $regex: searchplayer, $options: 'i' } })
        .then(match => {
            if (match[0] != null) {
                res.render('SearchPlayers', { searched: match });
            }
            else {
                res.redirect('/NotFound');
            }
        })
})

//Players

router.get('/Pardeep', loggedin, (req, res) => (res.render('Pardeep')));
router.get('/Abozar', loggedin, (req, res) => (res.render('abozar')));
router.get('/Ashish', loggedin, (req, res) => (res.render('Ashish')));
router.get('/Fazel', loggedin, (req, res) => (res.render('Fazel')));
router.get('/Jasmer', loggedin, (req, res) => (res.render('Jasmer')));
router.get('/Manjeet', loggedin, (req, res) => (res.render('Manjeet')));
router.get('/Meraj', loggedin, (req, res) => (res.render('Meraj')));
router.get('/Naveen', loggedin, (req, res) => (res.render('Naveen')));
router.get('/Pawan', loggedin, (req, res) => (res.render('Pawan')));
router.get('/Rahul', loggedin, (req, res) => (res.render('Rahul')));
router.get('/Ravinder', loggedin, (req, res) => (res.render('Ravinder')));
router.get('/Sandeep', loggedin, (req, res) => (res.render('Sandeep')));
router.get('/Siddharth', loggedin, (req, res) => (res.render('Siddharth')));
router.get('/Subash', loggedin, (req, res) => (res.render('Subash')));
router.get('/Vishal', loggedin, (req, res) => (res.render('vishal')));

//Tournaments

router.get('/VivoProKabaddi', loggedin, (req, res) => (res.render('VivoProKabaddi')));
router.get('/worldCup', loggedin, (req, res) => (res.render('worldCup')));

//Teams

router.get('/u_mumba', loggedin, (req, res) => (res.render('u_mumba')));
router.get('/bengaluru', loggedin, (req, res) => (res.render('bengaluru')));
router.get('/DabangDelhi', loggedin, (req, res) => (res.render('DabangDelhi')));
router.get('/telugu_titans', loggedin, (req, res) => (res.render('telugu_titans')));

// forgot password
router.get('/forgot', function (req, res) {
    res.render('forgot');
});

router.post('/forgot', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ uname: req.body.uname }, function (err, user) {
                if (!user) {
                    //req.flash('error', 'No account with that email address exists.');
                    console.log('No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'the12thman200@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'https://ritikkabaddi.herokuapp.com/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('mail sent');
                console.log('An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, done);
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/');
    });
});

router.get('/reset/:token', function (req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            console.log('Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', { token: req.params.token });
    });
});

router.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    console.log('Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {

                    //Hash Password
                    bcryprt.genSalt(10, (err, salt) =>
                        bcryprt.hash(req.body.password, salt, (err, hash) => {
                            if (err) throw err;
                            //Set password to hashed
                            newpassword = hash;
                            User.updateOne({ uname: user.uname }, { $set: { pass: newpassword } }, function (err, user) {
                                if (err) throw err;
                                console.log("Password Changed");
                                user.resetPasswordToken = undefined;
                                user.resetPasswordExpires = undefined;
                            
                                    req.logIn(user, function (err) {
                                        done(err, user);
                                    });
                            })
                        })

                    )

                } else {
                    console.log("Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'the12thman200@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('Success! Your password has been changed.');
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/Login.ejs');
    });
});


module.exports = router;
