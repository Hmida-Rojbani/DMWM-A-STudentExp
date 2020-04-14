const router = require('express').Router();
const { Student, student_not_valide, objectid_not_valid, student_opt_not_valide } = require('../models/student');
const _ = require('lodash');


router.get('',async (req,res)=>{
    const students = await Student.find();
    if(students.length ===0 )
        return res.status(204).end();
    res.send(students);
});

router.post('',async (req,res)=>{
    //request body content the data 
    /*const student = new Student({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    });*/

    //validation par joi
    let errors;
    if(errors=student_not_valide(req.body))
        return res.status(400).send(errors.details[0].message)
    const student = new Student(_.pick(req.body,['name','age','email']));
    try{
        const saved_student = await student.save();
        return res.status(201).send(saved_student);
    }catch(err){
        return res.status(400).send(`DB error : ${err.message}`)
    }
    
});

//get by id

router.get('/id/:id',async (req,res)=>{
    let errors;
    if(errors=objectid_not_valid(req.params))
        return res.status(400).send(errors.details[0].message)
    const student = await Student.findById(req.params.id);
    if(! student)
        return res.status(204).end();
    res.send(student);
});

//delete by id

router.delete('/id/:id',async (req,res)=>{
    let errors;
    if(errors=objectid_not_valid(req.params))
        return res.status(400).send(errors.details[0].message)
    const student = await Student.findByIdAndRemove(req.params.id);
    if(!student)
        return res.status(200).send('Student with this id is not found');
    res.send(student);
});

//Put by id (update)

router.put('/id/:id',async (req,res)=>{
    let errors;
    if(errors=objectid_not_valid(req.params))
        return res.status(400).send(errors.details[0].message)
    if(errors=student_opt_not_valide(req.body))
        return res.status(400).send(errors.details[0].message)
    let student = await Student.findById(req.params.id);
    if(! student)
        return res.status(200).send('Student with this id is not found');
    student = _.merge(student,req.body);
    // form with promise
    //student.save().then(()=>res.status(201).send(saved_student))
    //                .catch((err)=>res.status(400).send(`DB error : ${err.message}`));
    try{
        const saved_student = await student.save();
        return res.status(201).send(saved_student);
    }catch(err){
        return res.status(400).send(`DB error : ${err.message}`)
    }
});

// count students with an specific age
// count students with age between an intervall
// students with name contains a given string %like
module.exports = router;