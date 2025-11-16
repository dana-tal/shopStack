const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');


router.get('/all',categoryController.getAllCategories);
router.post('/add', categoryController.addCategory);
router.put('/update/:id', categoryController.updateCategory);
router.delete("/remove/:id", categoryController.removeCategory);


module.exports = router;

