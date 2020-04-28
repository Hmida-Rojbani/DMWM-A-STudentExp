const router = require('express').Router();
const { User, user_not_valide, user_login_not_valide } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth')

//register

router.post('/register',async (req,res)=>{
    let errors;
    if(errors=user_not_valide(req.body))
        return res.status(400).send(errors.details[0].message);
    let user = new User(_.pick(req.body,['name','email','password']));

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
    let errors;
    if(errors=user_login_not_valide(req.body))
        return res.status(400).send(errors.details[0].message);
    let login_user = _.pick(req.body,['username','password']);
    let user = await User.findOne({email : login_user.username});
    if(!user)
        return res.status(400).send('Username or password are incorrect.');
    
    let check = await bcrypt.compare(login_user.password, user.password);

    if(!check)
        return res.status(400).send('Username or password are incorrect.');

    const token  = user.generateAuthToken();
    return res.header('x-auth-token',token).send('User is logged');

});

//display profile
router.get('/me',auth,async(req,res)=>{
    const user = await  User.findById(req.user_token._id).select('-password');
    res.send(user);
})

module.exports = router;