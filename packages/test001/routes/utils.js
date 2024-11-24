

// Auth
var jwt = require('jsonwebtoken');


const checkUser=(req, res, next)=> {
    try{
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      const jwttoken = req.headers.authorization;
      const token = jwttoken.split(" ")[1];
      // console.log(Token)
      // console.log(jwt.verify(Token,jwtSecretKey)); 
      // console.log(req.query)
    
      // var id = req.body.id;
    
      // Some custom route logic with auth
    
      // const nonSecurePaths = ['/', '/about', '/contact'];
    
      // if (nonSecurePaths.includes(req.path)) return next();
    
      if ( req.path == '/public_api') return next();
    
      jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        console.log(decoded)
        req.userId = decoded.userId;
        next();
      });
    
    }catch(e){
    
      console.log(e)
      return res.status(403).json({ message: 'Failed to authenticate token' });
     
    }}


    function authRole(role) {
      
      return (req, res, next) => {
        if (req.body.role !== role) {
          res.status(401)
          return res.send('Not allowed')
        }
    
        next()
      }
    }


    module.exports = {checkUser,authRole}
