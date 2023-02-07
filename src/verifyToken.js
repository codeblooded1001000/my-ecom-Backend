const jwt = require('jsonwebtoken')

function verifyToken(req, res){
  if(!(req.headers.authorization)){
    return res.status(404).json({success:false, message: "Error!Token was not provided."})
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    //Authorization: 'Bearer TOKEN'
    const decodedToken = jwt.verify(token,"secretkeyappearshere" );
    return decodedToken; 
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(500).json({success:false, message: "Error!Token is expired please login again"})
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(500).json({success:false, message: "Error!Token is not valid."})
    }
  }
}

module.exports = verifyToken