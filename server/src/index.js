'use strict';
require('dotenv').config();

const app = require('./app');
const PORT = parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, function(){
    console.log('[Server] Running on port ' + PORT);
})

