const express = require('express');
const crypto = require('crypto');

const UserRoutes = require('./users/handler');
const ErrorHandler = require('./middleware/error_handler')

const app = express();

app.use(express.json());
app.use('/users', UserRoutes);

app.use(ErrorHandler)

module.exports = app;