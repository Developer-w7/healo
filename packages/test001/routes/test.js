const r1 =(req,res,next)=>{
    res.status(200).json({"status":"Public Route"})
  }

  const r2 =(req,res)=>{
    res.status(200).json({"status":"Private Route"})
  }


  module.exports.r1= r1;
  module.exports.r2= r2;