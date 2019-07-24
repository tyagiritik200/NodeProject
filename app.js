const express=require("express");
const expressLayouts=require("express-ejs-layouts");
var path=require("path");
const app=express();
const mongoose=require("mongoose");
const session=require('express-session');
const passport=require('passport');



//DB Config
const db=require('./config/Keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser:true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
 
//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Express Session
app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:false
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Passport Config
require('./config/passport')(passport);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use(express.static('public'));


app.use('/',require('./routes/index'));

const PORT=process.env.PORT || 5000;

app.listen(PORT,console.log('Server started on port 5000'));