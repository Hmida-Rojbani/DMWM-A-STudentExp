const winston = require('winston');
const express = require('express');
const app_debug = require('debug')('app:debug');
const app = express();
const port = process.env.PORT | 3000;



require('./startup/logging')();
require('./startup/db');
require('./startup/config')();
require('./startup/routes')(app);




app.listen(port, ()=> {
    app_debug(`Serveur running on ${port}...`)
    winston.info(`Serveur running on ${port}...`)
}
    );