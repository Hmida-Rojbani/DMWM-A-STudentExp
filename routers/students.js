const router = require('express').Router();
const { Student } = require('../models/student');

router.get('',async (req,res)=>{
    const students = await Student.find();
    if(students.length ===0 )
        return res.status(204).end();
    res.send(students);
});

router.post('',async (req,res)=>{
    //request body content the data 
    const student = new Student({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    });

    const saved_student = await student.save();
    res.status(201).send(saved_student);
});

module.exports = router;