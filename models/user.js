const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);
const jwt= require('jsonwebtoken');
const config= require('config');

const user_schema = new mongoose.Schema({
    name: {type :String, required : true},
    email : {type: String, unique : true, required : true},
    password : {type: String, required : true},
    isAdmin : {type : Boolean, default : false}
});

user_schema.methods.generateAuthToken = function (){
    const payload = {
        _id : this._id,
        name: this.name,
        isAdmin: this.isAdmin
    };
    const jwtPrivateKey = config.get('jwtPrivateKey');
    const token = jwt.sign(payload, jwtPrivateKey);
    return 'Bearer '+token;
}

const user_validation_schema= {
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password : Joi.string().regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})")).required(),
    isAdmin :Joi.boolean()
}

const user_login_validation_schema= {
    username: Joi.string().email().required(),
    password : Joi.string().regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})")).required(),
}

function user_not_valide(user) {
    var results = Joi.validate(user, user_validation_schema);
    return results.error;
}
function user_login_not_valide(user) {
    var results = Joi.validate(user, user_login_validation_schema);
    return results.error;
}

const User = mongoose.model('User',user_schema);

module.exports.User = User;
module.exports.user_not_valide = user_not_valide;
module.exports.user_login_not_valide = user_login_not_valide;