const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const urlRoutes = require('./routes/urlRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', urlRoutes);

module.exports = app;

