const express = require("express");
const UserModel = require("../models/user");
const testRouter = new express.Router();


testRouter.get('/getTest', async(req, res)=>{

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({SUCCESS:true});
  });

testRouter.get('/user', async(req, res)=>{
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


testRouter.get('/users', async(req, res)=>{

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






module.exports = testRouter;


const public =(req,res,next)=>{
    res.status(200).json({"status":"Public Route"})
}


const private =(req,res)=>{
    console.log(req.userId)
    let {userId} = req;
    res.status(200).json({"status":"Private Routes",userId})
}



module.exports.publicRouteTest= public;
module.exports.privateRouteTest= private;