const jwt= require('jsonwebtoken');
const config = require('config')

module.exports = function (req,res,next) {
    if(!req.header('x-auth-token'))
        return res.status(401).send('Access Denied. No token provided');
    const token = req.header('x-auth-token').substring(7);// substring to remove Bearer
    try{
    var decode_payload = jwt.verify(token,config.get('jwtPrivateKey'));
    req.user_token = decode_payload;
    next();
    }catch(err){
        return res.status(400).send('Invalid Token');
    }
}