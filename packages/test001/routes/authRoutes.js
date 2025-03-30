const express = require("express");
const authRouter = new express.Router();

// Auth
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const controllers = require("../controller/UserController");
const AuthController = require("../controller/AuthController");

const UserModel = require("../models/user");


var faker = require('faker');

// Registration Process

authRouter.post("/register", async (req, res) => {

     try {
      // const { name, email, password } = req.body;
       const { name, email, password } = {name:faker.name.findName(),email:faker.internet.email(),password:"123"};
  

       console.log(name)
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
  
      // Encrypt user password
      encryptedUserPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await UserModel.create({
        name: name,
        email: email.toLowerCase(), // sanitize
        password: encryptedUserPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { userId: user._id, email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "5h",
        }
      );

      user.token = token;
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
  });


  authRouter.post("/user/sendotp",AuthController.userOtpSend);
  authRouter.post("/user/login_with_otp",AuthController.userLoginWithOtp);




  // Login Generating JWT

  authRouter.post("/user/login", async (req, res) => {
    // Validate User Here // Then generate JWT Token // Using Username & Password get user id from db
  try{
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
        res.status(400).send("All input is required");
    }
        // Validate if user exist in our database
        const user = await UserModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
  
          const token = jwt.sign(
            { userId: user._id, email },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "5h",
            }
          );
          user.token = token;
          res.set({'X-AuthToken':token})
          return res.status(200).json(user);
  
        }else{
          return res.status(400).send("Invalid Credentials");
        }
  }catch(e){
    return res.status(400).send("Login Failed");
  }
  });

module.exports = authRouter;