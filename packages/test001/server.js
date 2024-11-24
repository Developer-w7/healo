
// Auth

// var jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// var passport = require('passport');
// var crypto = require('crypto');
// const { populate } = require('./models/student.js');
// const UserRoleModel = require('./models/user_role.js');
// var faker = require('faker');
// const Mongoose = require('mongoose');
// const upload = multer({ dest: './public/data/uploads/' })
// import {connectToDb} from "./db/connect";
// var apiRouter = require("./routes/api");
// const UserModel = require('./models/user.js');


const session = require('express-session');
const cors = require("cors")


require('dotenv').config();

const {connectToDb,connection} = require('./db/connect.js');



var express = require('express');


const MongoStore = require('connect-mongo');


//Import Untils

const { checkUser } = require('./routes/utils.js');

//Import Routes


const authRouter = require('./routes/authRoutes.js');
const testRouter = require('./routes/testRoutes.js');
const privateRouter = require('./routes/privateRoutes.js');
const publicRouter = require('./routes/publicRoutes.js');


var app = express();

try {connectToDb()} catch (error) {console.log(error)}


const hostname = '127.0.0.1';
const port = 5000;


app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended: true}));


// Set Session

try {
  app.use(
    session({
        secret: 'story book',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
          mongoUrl: process.env.connectionString
      }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
      }
    })
  );
  
} catch (error) {
  console.log(error)
}


// Image Upload Set Up
app.use('/uploads', express.static('uploads'))
app.use(express.static(__dirname + "/public"));


// <-- Routes -->

app.use(authRouter); //Public

app.use(testRouter) //Public // Need To Remove On Prod 

app.use(publicRouter) //Public

app.use(checkUser) // User Authentication

app.use(privateRouter)



app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});




