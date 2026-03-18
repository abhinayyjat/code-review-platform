'use strict';
const express   = require('express');
const helmet    = require('helmet');
const cors      = require('cors');
const morgan    = require('morgan');
const passport  = require('passport');
const rateLimit = require('express-rate-limit');
const { server } = require('./config/env');
require('./config/passport'); // side-effect: registers GitHub strategy

const app = express();

app.use(helmet());
app.use(cors({ origin: server.clientUrl, methods: ['GET','POST','PUT','PATCH','DELETE'], credentials: true }));
app.use(rateLimit({ windowMs: 15*60*1000, max: 100, standardHeaders: true, legacyHeaders: false }));
app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ extended: false, limit: '512kb' }));
app.use(morgan(server.isDev ? 'dev' : 'combined'));
app.use(passport.initialize());

app.get('/api/health', function(req, res) { res.json({ status: 'ok' }); });
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/teams',   require('./routes/teams'));
app.use('/api/users',   require('./routes/users'));
app.use('/webhook',     require('./routes/webhook'));

app.use(function(req, res) { res.status(404).json({ error: req.method + ' ' + req.path + ' not found' }); });
app.use(require('./middleware/errorHandler'));

module.exports = app;
