const jwt = require('jsonwebtoken')

function verifyToken(req){
  const token = req.headers.authorization.split(' ')[1];
  //Authorization: 'Bearer TOKEN'
  if(!token)
  {
    res.status(200).json({success:false, message: "Error!Token was not provided."});
  }
  const decodedToken = jwt.verify(token,"secretkeyappearshere" );
  return decodedToken;
}

module.exports = verifyToken