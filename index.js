require('./db/connection')('mongodb+srv://user:1234@mongoformation-xc16w.mongodb.net/dmwmA?retryWrites=true&w=majority')
const express = require('express');
const app_debug = require('debug')('app:debug');
const app = express();
const morgan = require('morgan');
const port = process.env.PORT | 3000;

app.use(express.json());
app.use(morgan('dev'));



app.listen(port, ()=> app_debug(`Serveur running on ${port}...`));