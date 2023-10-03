const express    = require('express');
const config     = require('config');
const cors       = require('cors');
const db = require("./config/db");
require('dotenv').config();


const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//routes
app.use(require('./api/routes/routes'));
app.listen(process.env.PORT || config.get('server.port'));
console.log(`Server is running on port ${process.env.PORT || config.get('server.port')}`)