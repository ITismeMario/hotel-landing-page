const express = require('express');
const { registerUser, loginUser } = require('../controllers/userControllers');
const router = express.Router();
const { validateCreateUser, validateLogin } = require('../validations/userValidate');

router.route('/register').post(validateCreateUser, registerUser);
router.route('/login').post(validateLogin, loginUser);

module.exports = router;
