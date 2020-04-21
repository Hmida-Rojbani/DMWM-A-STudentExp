const router = require('express').Router();
const { Student, student_not_valide, objectid_not_valid, student_opt_not_valide } = require('../models/student');
const _ = require('lodash');
const { ClassRoom } = require('../models/class_room');


router.get('',async (req,res)=>{
    const students = await Student.find().populate('class_room.class_room_id');
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
    const student = new Student(_.pick(req.body,['name','age','email','extra_price','class_room']));
    let class_room = await ClassRoom.findById(student.class_room.class_room_id);
    if(!class_room)
        return res.status(400).send('ClassRoom not found with the given id');
    student.class_room.name = class_room.name;
    try{
        const saved_student = await student.save();
        class_room.nb_student += 1;
        await class_room.save();
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
        return res.status(400).send('Student with this id is not found');
    if(req.body.class_room.class_room_id){
        var new_class_room = await ClassRoom.findById(req.body.class_room.class_room_id);
        if(! new_class_room)
            return res.status(400).send('ClassRoom with this id is not found');
    }
    var old_class_room = await ClassRoom.findById(student.class_room.class_room_id);
    student = _.merge(student,req.body);
    // form with promise
    //student.save().then(()=>res.status(201).send(saved_student))
    //                .catch((err)=>res.status(400).send(`DB error : ${err.message}`));
    try{
        if(req.body.class_room.class_room_id){
            student.class_room.name=new_class_room.name;
            old_class_room.nb_student-=1;
            new_class_room.nb_student+=1;
        }
        const saved_student = await student.save();
        await old_class_room.save();
        await new_class_room.save();

        return res.status(201).send(saved_student);
    }catch(err){
        return res.status(400).send(`DB error : ${err.message}`)
    }
});

// count students with an specific age
router.get('/count/age/:age', async (req,res)=>{
    if(errors=student_opt_not_valide(req.params))
        return res.status(400).send(errors.details[0].message)
    const students = await Student.find({age : req.params.age});
    res.send(`${students.length} is the number of students with the age ${req.params.age}`);
})
// count students with age between an intervall
router.get('/count/age/min/:min_age/max/:max_age', async (req,res)=>{
    if(errors=student_opt_not_valide(req.params))
        return res.status(400).send(errors.details[0].message)
    if(req.params.min_age > req.params.max_age)
    return res.status(400).send('min_age must be less or equals max_age')
    const students = await Student.find({age : { $gte :req.params.min_age, $lte: req.params.max_age}});
    res.send(`${students.length} is the number of students with the age between [${req.params.min_age},${req.params.max_age}]`);
})
// students name and id of stdents with name contains a given string %like%
router.get('/name/like/:part_name', async (req,res)=>{
    if(errors=student_opt_not_valide(req.params))
        return res.status(400).send(errors.details[0].message)
    const students = await Student.find({name : { $regex : req.params.part_name, $options:"i"}})
                                    .select('name');
    res.send(students);
})

// extra price add if age > 25

// collection classRoom 
module.exports = router;