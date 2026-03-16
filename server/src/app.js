const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(cors({origin: process.env.CLIENT_URL || 'http://localhost:5137'}));
app.use(express.json({limit : '512kb'}));
app.use(morgan('dev'));

app.get('/api/health', function(req,res){
    res.json({status: 'okay', timestamp: new Date().toISOString()});
});
//this is the 404 handler
app.use(function(req, res){
    res.status(404).json({error: req.method + ' ' + req.path + ' not found'});
});

module.exports = app;