const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.get('/all',productController.getAllProducts);
router.get('/page',productController.getProductsPage); // // GET /product/page?pageNum=1&pageSize=10&isActive=true
router.get('/:id', productController.getProductById);
router.post('/add', productController.addProduct);
router.put('/update/:id', productController.updateProduct);
router.delete("/remove/:id", productController.deleteProduct);
router.delete("/remove-many",productController.deleteProducts);

module.exports = router;

