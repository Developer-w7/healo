const express = require("express");
const publicRouter = new express.Router();

const multer  = require('multer');
const sharp = require('sharp');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//serving index.html to '/
publicRouter.get("/home", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });
  

publicRouter.post("/upload", upload.single("imageInput"), (req, res) => {
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


  publicRouter.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  
    res.status(200).json({"success":true})
    
  })




publicRouter.post('/public_api', (req,res,next)=>{
    res.status(200).json({"status":"Public Route"})
});


module.exports = publicRouter;