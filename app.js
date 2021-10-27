const path = require('path');
const express = require('express');
const grobalError = require('./controller/errorController');
const AppError = require('./utils/appError')
const userRoute = require('./routes/userRoute')

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use('/user', userRoute);

app.all('*', (req, res, next) => {
    next(new AppError(`404 error url did not found ${req.originalUrl}`, 404))
});

//globale middlelware
//this call directly when error occure
app.use(grobalError);

module.exports = app;

