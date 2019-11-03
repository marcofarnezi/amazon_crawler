const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

function connect() {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose;
            const mockoose = new Mockgoose(mongoose);
            mockoose.prepareStorage()
                .then(() => {
                    mongoose.connect(process.env.MONGO_SERVER,{
                        useNewUrlParser: true
                    })
                    .then((res, err) => {
                        if (err) return reject(err);
                        resolve();
                    })    
                })
        } else {
            mongoose.connect(process.env.MONGO_SERVER,{
                useNewUrlParser: true
            })
            .then((res, err) => {
                if (err) return reject(err);
                resolve();
            })    
        }
    });
}

module.exports = { connect };