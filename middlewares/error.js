module.exports = function(err,req,res,next){
    res.status(500).send('Something failed in the Server.'+err.message);

}