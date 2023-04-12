const Project = require('../models/Project');
const User = require('../models/User')
const { v4: uuid4 } = require("uuid");

async function getAllProjects (req, res) {
    try {
        const allProjects = await Project.find({});
        res.json({succes:true, projects: allProjects });
    } catch(e) {
        console.error(e);
    	res.json({ success: false, message: e.toString() });
    }
};

async function getUserProjects (req, res) {
    try {
        const entryId = req.params.id;
        const user = await User.findById(entryId);
        const userProjects = [];
        for(const id of user.projects){
            const project = await Project.findById(id);
            userProjects.push(project);
        }
        res.json({success:true, userProjects: userProjects});
    } catch (e) {
        console.error(e);
    	res.json({ success: false, message: e.toString() });
    }
}

async function getAllTasks (req, res) {
    try {
        const entryId = req.params.id;
        const project = await Project.findById(entryId);
        const tasks = project.task;
        res.json({success: true, tasks: tasks});
    } catch (e) {
        console.error(e);
    	res.json({ success: false, message: e.toString() });
    }
}

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
        assignedUsers.push(userId);
        const _id = uuid4();
        if(req.body.assignedUsers !== undefined){
            const usersToBeAdded = req.body.assignedUsers.split(', ');
            for(const name of usersToBeAdded){
                const user = await User.find({name});
                assignedUsers.push(user[0]._id);
                user[0].projects.push(_id);
                user[0].lastModifiedAt = Date.now();
                await user[0].save();
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
        const usersToBeAdded = req.body.assignedUsers.split(', ');
        for(const name of usersToBeAdded){
            const user = await User.find({name});
            assignedUsers.push(user[0]._id);
            user[0].tasks.push(_id);
            user[0].lastModifiedAt = Date.now();
            await user[0].save();
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
        const task = await project.task.id(req.params.taskId);
        if(req.body.taskName !== undefined){
            task.taskName = req.body.taskName;
        }
        if(req.body.dueDate !== undefined){
            task.dueDate = req.body.dueDate;
        }
        if(req.body.description !== undefined){
            task.description = req.body.description;
        }
        for(const id of task.assignedUsers){
            const user = await User.findById(id);
            for(const taskId of user.tasks){
                if(task._id === taskId){
                    const index = user.tasks.indexOf(taskId);
                    user.tasks.splice(index, 1);
                    await user.save();
                }
            }
        }
        task.assignedUsers = [];
        if(req.body.assignedUsers){
            const usersToBeAdded = req.body.assignedUsers.split(', ');
            for(const name of usersToBeAdded){
                const user = await User.find({name});    
                user[0].tasks.push(task._id);
                user[0].lastModifiedAt = Date.now();
                task.assignedUsers.push(user[0]._id);
                await user[0].save();
            }
        }
        task.status = req.body.status;
        task.lastModifiedAt = Date.now();
        task.save();
        project.save();
        res.json({ success: true });
    } catch (e) {
        console.error(e);
    	res.json({ success: false, message: e.toString() });
    }
}

async function deleteTask (req, res) {
    try {
        const projectId = req.params.projectId;
        const taskId = req.params.taskId;
        const project = await Project.findById(projectId);
        const task = project.task.id(taskId);
        for(const id of task.assignedUsers){
            const user = await User.findById(id);
            for(const task of user.tasks){
                if(task === taskId){
                    const index = user.tasks.indexOf(taskId);
                    user.tasks.splice(index, 1);
                    await user.save();
                }
            }
        }
        await project.task.pull(taskId);
        await project.save();
        res.json({success:true});
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
    getUserProjects,
    getAllTasks,
    deleteTask
};