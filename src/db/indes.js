const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

function connect() {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGO_SERVER,{
            useNewUrlParser: true
        })
        .then((res, err) => {
            if (err) return reject(err);
            resolve();
        })    
    });
}

module.exports = { connect };