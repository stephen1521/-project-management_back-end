const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/all', userController.getAllUsers);
router.put('/updateUser/:email', userController.updateUser);

module.exports = router;