const router = require('express').Router();
const { User, user_not_valide } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

//register

router.post('/register',async (req,res)=>{
    let errors;
    if(errors=user_not_valide(req.body))
        return res.status(400).send(errors.details[0].message);
    let user = new User(_.pick(req.body,['name','email','password','isAdmin']));

    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    try{
        user = await user.save();
        return res.status(201).send('User registred');
    }catch(err){
        return res.status(400).send('DB Error :'+ err.message);
    }

})


//login

router.post('/login',async (req,res)=>{
});



module.exports = router;