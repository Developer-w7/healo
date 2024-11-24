
const express = require("express");
const privateRouter = new express.Router();


privateRouter.post('/secured_api', (req,res,next)=>{
    res.status(200).json({"status":"Private Route"})
});


module.exports = privateRouter;