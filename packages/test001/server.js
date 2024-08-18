// import {connectToDb} from "./db/connect";

// Auth
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');

const multer  = require('multer');
const sharp = require('sharp');
const storage = multer.memoryStorage();
// const upload = multer({ dest: './public/data/uploads/' })
const upload = multer({ storage: storage });
const cors = require("cors") //Newly added


require('dotenv').config();

const {connectToDb,connection} = require('./db/connect.js');
var apiRouter = require("./routes/api");
const UserModel = require('./models/user.js');
// const UserRoleModel = require('./models/user_role.js');

// let customerId = null;
var express = require('express');
// const Mongoose = require('mongoose');

const MongoStore = require('connect-mongo');
var faker = require('faker');
const { r1, r2 } = require('./routes/test.js');
// const { populate } = require('./models/student.js');
var app = express();

app.use(cors()) // Newly added

try {
  connectToDb();
} catch (error) {
  
}

// const http = require('http');
// const test = require('./test');

const hostname = '127.0.0.1';
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
console.log(process.env.connectionString)

const secretKey = process.env.secretKey;

console.log(secretKey)

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
  
}



app.use("/", apiRouter);

// app.get("/mock-data", (req, res) => {
//   res.status(200).json({"success":true})
// });


// Image Upload
app.use('/uploads', express.static('uploads'))
app.use(express.static(__dirname + "/public"));


app.post("/upload", upload.single("imageInput"), (req, res) => {
  const image = sharp(req.file.buffer);
  image
    .jpeg({ mozjpeg: true })
    .toBuffer()
    .then(function (data) {
      console.log("data",data);
      let base64Encoded = data.toString("base64");
      const url = `data:image/jpeg;base64,${base64Encoded}`;

      res.status(200).send({ data: url });
    });

});



//serving index.html to '/
app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});



// Main Code Here //


// Generating JWT
app.post("/user/login", (req, res) => {
  // Validate User Here
  // Then generate JWT Token

  //Using Username & Password get user id from db

  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
      time: Date(),
      userId: 12,
  }

  const token = jwt.sign(data, jwtSecretKey);
  res.set({'X-AuthToken':token})
  res.send({token, id:10});
});

// Create Auth

app.post("/register", async (req, res) => {

  // Our register logic starts here
   try {
    // Get user input
    const { name, email, password } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedUserPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await UserModel.create({
      name: name,
      email: email.toLowerCase(), // sanitize
      password: encryptedUserPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "5h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});


//User Authentication

function checkUser(req, res, next) {
try{
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  const jwttoken = req.headers.authorization;
  const token = jwttoken.split(" ")[1];
  // console.log(Token)
  // console.log(jwt.verify(Token,jwtSecretKey)); 
  // console.log(req.query)

  var id = req.body.id;

  // Some custom route logic with auth

  // const nonSecurePaths = ['/', '/about', '/contact'];

  // if (nonSecurePaths.includes(req.path)) return next();

  if ( req.path == '/public_api') return next();

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    req.userId = decoded.userId;
    next();
  });

}catch(e){

  console.log(e)
  return res.status(403).json({ message: 'Failed to authenticate token' });
 
}}


// app.use(checkUser)

app.post('/public_api', checkUser,  r1);

app.post('/secured_api', checkUser,  r2);




app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any

  res.status(200).json({"success":true})
  
})




app.get('/users', async(req, res)=>{

  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 10
}

UserModel.find()
  .skip(pageOptions.page * pageOptions.limit)
  .limit(pageOptions.limit)
  .exec().then((err, doc) =>{
      if(err) { res.status(500).json(err); return; };
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json(doc);
  });

});

app.get('/user', async(req, res)=>{
  UserModel.find({_id:"62ebdcdb21dc0bf08ed058ec"})
  .populate('course')
  .populate('college')
  .populate('role')
  .populate('instructors')
  .exec().then((err, doc) =>{
      if(err) { res.status(500).json(err); return; };
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json(doc);
  });

});




app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});




