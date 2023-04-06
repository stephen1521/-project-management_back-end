const { off } = require('../models/Project');
const Project = require('../models/Project');

async function getAllProjects (req, res) {
    try {
        const allProjects = await Project.find({});
        res.json({projects: allProjects });
    } catch(e) {
        console.log(e);
    }
};

async function createProject (req, res) {
    try {
        const projectName = req.body.projectName;
        const createdBy = req.body.createdBy;
        const createdAt = req.body.createdAt;
        const lastModifiedAt = req.body.lastModifiedAt;
        const dueDate = req.body.dueDate;
        const description = req.body.description;
        const newProject = new Project ({
            projectName,
            createdBy,
            createdAt,
            lastModifiedAt,
            dueDate,
            description
        })
        await newProject.save();
    	res.json({ success: true });
    } catch(e) {
        console.error(e);
    	res.json({ success: false, message: e.toString() });
    }
}

async function createTask (req, res) {
    try {
        const entryId = req.params.id;
        const taskName = req.body.taskName;
        const createdBy = req.body.createdBy;
        const createdAt = req.body.createdAt;
        const lastModifiedAt = req.body.lastModifiedAt;
        const dueDate = req.body.dueDate;
        const description = req.body.description;
        const assignedUsers = [];
        for(const users of req.body.assignedUsers){
            assignedUsers.push(users);
        }
        const newTask = {
            taskName: taskName,
            createdBy: createdBy,
            createdAt: createdAt,
            lastModifiedAt: lastModifiedAt,
            dueDate: dueDate,
            description: description,
            assignedUsers: assignedUsers
        }
        const project = await Project.findById(entryId);
        project.task.push(newTask);
        project.lastModifiedAt = Date.now();
        await project.save();
        res.json({ success: true });
    } catch (e) {
        console.error(e);
    	res.json({ success: false, message: e.toString() });
    }
}

async function updateProject (req, res) {
    try {
        const entryId = req.params.id;
        const project = await Project.findById(entryId);
        if(req.body.projectName !== undefined){
            project.projectName = req.body.projectName;
        }
        if(req.body.assignedUsers !== undefined){
            for(const users of req.body.assignedUsers){
                project.assignedUsers.push(users);
            }
        }
        if(req.body.dueDate !== undefined){
            project.dueDate = req.body.dueDate;
        }
        if(req.body.description !== undefined){
            project.description = req.body.description;
        }
        project.lastModifiedAt = Date.now();
        project.save();
        res.json({ success: true });
    } catch (e) {
        console.error(e);
    	res.json({ success: false, message: e.toString() });
    }
}

async function updateTask (req, res) {
    try {
        const entryId = req.params.projectId;
        const project = await Project.findById(entryId);
        const task = project.task.id(req.params.taskId);
        if(req.body.taskName !== undefined){
            task.taskName = req.body.taskName;
        }
        if(req.body.dueDate !== undefined){
            task.dueDate = req.body.dueDate;
        }
        if(req.body.description !== undefined){
            task.description = req.body.description;
        }
        if(req.body.assignedUsers !== undefined){
            for(const users of req.body.assignedUsers){
                task.assignedUsers.push(users);
            }
        }
        task.lastModifiedAt = Date.now();
        task.save();
        project.save();
        res.json({ success: true });
    } catch (e) {
        console.error(e);
    	res.json({ success: false, message: e.toString() });
    }
}


module.exports = {
    getAllProjects,
    createProject,
    createTask,
    updateProject,
    updateTask,
};