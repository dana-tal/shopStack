const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require("../middleware/auth");

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout',authController.logoutUser);
router.get("/me", verifyToken, (req, res) => {
     
  return res.json({ ok: true, userData: req.user });
});


module.exports = router;

