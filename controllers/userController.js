const {
    generatePasswordHash,
    validatePassword,
    generateUserToken,
    verifyToken,
	} = require("../auth");

const User = require('../models/User');

/* GET users listing. */
async function getAllUsers (req, res) {
    try {
        const allUsers = await User.find({});
        res.json({users: allUsers });
      }catch(e){
        console.log(e);
      }
};

// Register Users into db 
async function registration (req, res) {
  	try {
    	const email = req.body.email;
    	const nonHashPassword = req.body.password;
		const createdAt = Date.now();
		const lastModifiedAt = Date.now();
    	const saltRounds = 5; // In a real application, this number would be somewhere between 5 and 10
    	const password = await generatePasswordHash(nonHashPassword, saltRounds);
		const newUser = new User ({
            email,
            password,
			createdAt,
			lastModifiedAt
        })
        await newUser.save();
    	res.json({ success: true });
  	} catch (error) {
    	console.error(error);
    	res.json({ success: false, message: error.toString() });
  	}
};

// login
async function login (req, res) {
  	try {
    	const email = req.body.email;
    	const password = req.body.password;
    	const user = await User.findOne({email:email});
    	if (!user) {
      		res.json({ success: false, message: "Could not find user." }).status(204);
      	return;
    	}
    	const isPWValid = await validatePassword(password, user.password);
    	if (!isPWValid) {
      	res.json({ 
			success: false, 
			message: "Password was incorrect."}).status(204);
      	return;
    	}
    	const userType = email.includes("admin.com") ? "admin" : "user";
    	const data = {
      		date: new Date(),
      		userId: user.id, 
      		scope: userType,
			email: email
    	};
    	const token = generateUserToken(data);
    	res.json({ success: true, token, email });
    	return;
  	} catch (error) {
    	console.error(error);
    	res.json({ success: false, message: error.toString() });
  	}
};

// Updating user info
async function updateUser (req, res) {
	const entryEmail = req.params.email;
    try {
        const name = req.body.name;
		const email = req.body.email;
    	const password = req.body.password;
    	const saltRounds = 5; // In a real application, this number would be somewhere between 5 and 10
    	const hashPassword = await generatePasswordHash(password, saltRounds);
		const userUpdated = {
            name: name,
			email: email,
			password: hashPassword,
            lastModifiedAt: Date.now
		}
        await User.findOneAndUpdate({email:entryEmail}, userUpdated);
    } catch (err) {
        console.log(err);  
    }
    res.json({
        success: true,
        message: `User updated`
    })
}

module.exports = {
    registration,
    login,
    getAllUsers,
	updateUser
};