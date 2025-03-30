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

  try {
    // We destructure the req.query object to get the page and limit variables from url 
    const { page = 1, limit = 10 } = req.query;

    const usersList = await UserModel.find()
        // We multiply the "limit" variables by one just to make sure we pass a number and not a string
        .limit(limit * 1)
        // I don't think i need to explain the math here
        .skip((page - 1) * limit)
        // We sort the data by the date of their creation in descending order (user 1 instead of -1 to get ascending order)
        .sort({ createdAt: -1 })

    // Getting the numbers of products stored in database
    const count = await UserModel.countDocuments();

    return res.status(200).json({
        usersList,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    });
} catch (err) {
    next(err);
}



//Below code stopped working on 2025 Mar
  //   const pageOptions = {
  //     page: parseInt(req.query.page, 10) || 0,
  //     limit: parseInt(req.query.limit, 10) || 10
  // }
  // const skipLimit = pageOptions.page * pageOptions.limit;


  // UserModel.find({})
  //   .skip(parseInt(skipLimit))
  //   .limit(pageOptions.limit)
  //   .exec().then((err, doc) =>{
      
  //       if(doc) { res.status(500).json(err);  return; };
  //       res.setHeader('Content-Type', 'text/plain');
  //       res.setHeader('Access-Control-Allow-Origin', '*');
  //       res.status(200).json(err);
  //   });
  
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