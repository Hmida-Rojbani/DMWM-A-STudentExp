const winston = require('winston')
module.exports = function(err,req,res,next){
    winston.error('Something failed in the Server.'+err.message);
    // or we can have
    //winston.warn
    //winston.info
    //winston.verbose
    //winston.debug
    //winston.silly
    res.status(500).send('Something failed in the Server.'+err.message);

}