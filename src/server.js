const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db/indes')
dotenv.config();
const PORT = process.env.PORT || 3333;

const routes = require('./routes');
const server = express();


server.use(cors());
server.use(express.json());
server.use(routes);
db.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log("Listening on port " + PORT);
        });
    })
