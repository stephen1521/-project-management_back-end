const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = process.env.ATLAS_URI;
async function mongooseConnect(){
    try{
        await mongoose.connect(mongoDB);
        console.log('Connected to mongoDB through mongoose');
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    mongooseConnect
}