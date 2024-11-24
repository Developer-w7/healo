
const express = require("express");
const { authRole } = require("./utils");
const { ROLE, users } = require('../constants/roles')
const privateRouter = new express.Router();


// Admin Routes
privateRouter.post('/admin_home', authRole(ROLE.ADMIN), (req,res,next)=>{
    res.status(200).send("Admin Route")
});

// Sub Admin Routes

// Auditor

// Author

// Controller

// Previlaged User Routes
privateRouter.post('/secured_api', authRole(ROLE.BASIC), (req,res,next)=>{
    res.status(200).json({"status":"Private Route"})
});


module.exports = privateRouter;