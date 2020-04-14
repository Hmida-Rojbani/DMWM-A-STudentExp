const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);

const student_schema = new mongoose.Schema({
    name: {type: String, required:true},
    age: Number,
    email: {type: String, unique: true, required: true},
    extra_price : { type : Number, required : function () { return this.age >25 ;}},
    class_room : {
        class_room_id : {type: mongoose.Schema.ObjectId, ref :'ClassRoom'},
        name : {type: String, required : true, enum : ['DMWM','GLSI','SSIR','DSEN']}
    }
});

const student_validation_schema= {
    name: Joi.string().min(3).required(),
    age: Joi.number().positive(),
    email: Joi.string().email().required(),
    extra_price : Joi.number().positive(),
    class_room : {
        class_room_id : Joi.objectid().required()
    }
}

const student_opt_validation_schema= {
    name: Joi.string().min(3),
    part_name: Joi.string(),
    age: Joi.number().positive(),
    min_age: Joi.number().positive(),
    max_age: Joi.number().positive(),
    email: Joi.string().email(),
    extra_price : Joi.number().positive(),
    class_room : {
        class_room_id : Joi.objectid()
    }
}

const objectid_valid_schema = {
    id: Joi.objectid().required()
}

function objectid_not_valid(id){
    var results = Joi.validate(id, objectid_valid_schema);
    return results.error;
}
function student_not_valide(student) {
    var results = Joi.validate(student, student_validation_schema);
    return results.error;
}
function student_opt_not_valide(student) {
    var results = Joi.validate(student, student_opt_validation_schema);
    return results.error;
}
const Student = mongoose.model('Student',student_schema);

module.exports.Student = Student;
module.exports.student_not_valide = student_not_valide;
module.exports.student_opt_not_valide = student_opt_not_valide;
module.exports.objectid_not_valid = objectid_not_valid;