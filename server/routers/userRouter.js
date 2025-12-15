const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/all',userController.getAllUsers);
router.delete("/remove-many",userController.deleteUsers);

module.exports = router;
