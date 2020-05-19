const express = require('express');
const student_router = require('../routers/students');
const index_router = require('../routers/index');
const class_room_router = require('../routers/class_rooms');
const user_router = require('../routers/users');
const error = require('../middlewares/error');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet')

module.exports = function(app) {
    app.use(compression());
    app.use(helmet())
    if(app.get('env')==='development')
        app.use(morgan('dev'));
    app.use(express.json());
    app.use(['','/'], index_router);
    app.use('/api/students',student_router);
    app.use('/api/class_rooms',class_room_router);
    app.use('/api/users',user_router);
    app.use(error);
}