const mongoose = require("mongoose");
const { v4: uuid4 } = require("uuid");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: {unique: true}},
    password: { type: String, required: true},
    tasks: { type: [String]},
    projects: { type: [String]}, 
    _id: {type: String, default: uuid4},
    createdAt: { type: Date, defualt: Date.now, required: true},
    lastModifiedAt: { type: Date, defualt: Date.now, required: true}
});

//register model to collection
const User = mongoose.model("users", UserSchema);

//make out model accesible to files
module.exports = User;