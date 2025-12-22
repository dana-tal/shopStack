const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/all',userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.delete("/remove-many",userController.deleteUsers);
router.put('/update/:id', userController.updateUser);

module.exports = router;
