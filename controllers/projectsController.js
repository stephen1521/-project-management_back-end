const Project = require('../models/Project');
const User = require('../models/User')
const { v4: uuid4 } = require("uuid");

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
        const userId = req.params.id;
        const projectName = req.body.projectName;
        const createdBy = req.params.id;
        const createdAt = Date.now()
        const lastModifiedAt = Date.now()
        const dueDate = req.body.dueDate;
        const description = req.body.description;
        const assignedUsers = [];
        const _id = uuid4();
        if(req.body.assignedUsers !== undefined){
            for(const id of req.body.assignedUsers){
                assignedUsers.push(id);
                const user = await User.findById(userId);
                user.projects.push(_id);
            }
        }
        const newProject = new Project ({
            projectName,
            createdBy,
            createdAt,
            lastModifiedAt,
            dueDate,
            description,
            _id,
            assignedUsers
        })
        await newProject.save();
        const user = await User.findById(userId);
        user.projects.push(_id);
        user.lastModifiedAt = Date.now();
        await user.save();
    	res.json({ success: true });
    } catch(e) {
        console.error(e);
    	res.json({ success: false, message: e.toString() });
    }
}

async function createTask (req, res) {
    try {
        const entryId = req.params.projectId;
        const userId = req.params.userId;
        const taskName = req.body.taskName;
        const createdBy = req.params.userId;
        const createdAt = Date.now();
        const lastModifiedAt = Date.now();
        const dueDate = req.body.dueDate;
        const description = req.body.description;
        const assignedUsers = [];
        const _id = uuid4();
        for(const id of req.body.assignedUsers){
            assignedUsers.push(id);
            const user = await User.findById(id)
            user.tasks.push(_id);
            user.lastModifiedAt = Date.now();
            await user.save();
        }
        const newTask = {
            taskName: taskName,
            createdBy: createdBy,
            createdAt: createdAt,
            lastModifiedAt: lastModifiedAt,
            dueDate: dueDate,
            description: description,
            assignedUsers: assignedUsers,
            _id: _id
        }
        const project = await Project.findById(entryId);
        project.task.push(newTask);
        project.lastModifiedAt = Date.now();
        await project.save();
        const user = await User.findById(userId);
        user.tasks.push(_id);
        user.lastModifiedAt = Date.now();
        await user.save();
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
            for(const id of req.body.assignedUsers){
                project.assignedUsers.push(id);
                const user = await User.findById(id)
                user.projects.push(entryId);
                user.lastModifiedAt = Date.now();
                await user.save();
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
            for(const id of req.body.assignedUsers){
                task.assignedUsers.push(id);
                const user = await User.findById(id)
                user.tasks.push(req.params.taskId);
                user.lastModifiedAt = Date.now();
                await user.save();
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