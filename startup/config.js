module.exports = function(){
    if(!process.env.secret_jwt || !process.env.secret_mongo){
        throw new Error('FATAL ERROR: some secret env varibales are not defined');
    }
}