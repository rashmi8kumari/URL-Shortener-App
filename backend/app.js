const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const urlRoutes = require('./routes/urlRoutes');
const authRoutes = require('./routes/authRoutes');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', urlRoutes);
app.use('/api/auth', authRoutes);


module.exports = app;

