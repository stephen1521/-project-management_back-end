const mongoose = require("mongoose");
const { v4: uuid4 } = require("uuid");

const TaskSchema = new mongoose.Schema({
    taskName: {type: String, required: true},
    createdBy: { type: String, required: true},
    createdAt: { type: Date, defualt: Date.now, required: true},
    lastModifiedAt: { type: Date, defualt: Date.now, required: true},
    dueDate: { type: Date, defualt: Date.now, required: true},
    _id: {type: String, default: uuid4},
    description: {type: String, required: true},
    assignedUsers: {type: [String], required: true},
    status: {type: String, default: 'not-started'}
})
 
const ProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true},
    task: [ TaskSchema ],
    createdBy: { type: String, required: true},
    assignedUsers: { type: [String]},
    _id: {type: String, default: uuid4},
    createdAt: { type: Date, defualt: Date.now, required: true},
    lastModifiedAt: { type: Date, defualt: Date.now, required: true},
    dueDate: { type: Date, defualt: Date.now, required: true},
    description: { type: String, required: true}
});

//register model to collection
const Project = mongoose.model("projects", ProjectSchema);

//make out model accesible to files
module.exports = Project;