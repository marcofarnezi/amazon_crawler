const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const routes = require('./routes');
const server = express();

mongoose.connect(process.env.MONGO_SERVER,{
    useNewUrlParser: true
});

server.use(cors());
server.use(express.json());
server.use(routes);
server.listen(3333);