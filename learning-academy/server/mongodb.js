const mongoose = require('mongoose');

const ConnectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log('DB connected');
    }
    catch(err){
console.log(err);
    }
}

module.exports = ConnectDB;