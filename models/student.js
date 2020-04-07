const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);

const student_schema = new mongoose.Schema({
    name: {type: String, required:true},
    age: Number,
    email: {type: String, unique: true, required: true}
});

const student_validation_schema= {
    name: Joi.string().min(3).required(),
    age: Joi.number().positive(),
    email: Joi.string().email().required()
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
const Student = mongoose.model('Student',student_schema);

module.exports.Student = Student;
module.exports.student_not_valide = student_not_valide;
module.exports.objectid_not_valid = objectid_not_valid;