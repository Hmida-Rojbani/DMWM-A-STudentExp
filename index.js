require('express-async-errors');
const error = require('./middlewares/error');
const config = require('config');
require('./db/connection')(config.get('db.prot')+config.get('db.coord')+config.get('db.path'))
const express = require('express');
const app_debug = require('debug')('app:debug');
const app = express();
const morgan = require('morgan');
const port = process.env.PORT | 3000;
const student_router = require('./routers/students');
const class_room_router = require('./routers/class_rooms');
const user_router = require('./routers/users');
const auth = require('./middlewares/auth')
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/students',student_router);
app.use('/api/class_rooms',auth,class_room_router);
app.use('/api/users',user_router);
app.use(error);


app.listen(port, ()=> app_debug(`Serveur running on ${port}...`));