const express = require('express');
const { registerUser } = require('../controllers/userControllers');
const router = express.Router();
const { validateCreateUser } = require('../validations/userValidate');

router.route('/register').post(validateCreateUser, registerUser);

module.exports = router;
