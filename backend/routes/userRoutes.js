const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile, deleteUser } = require('../controllers/userControllers');
const { isAuthenticated } = require('../middlewares/auth');
const { validateCreateUser, validateLogin, validateUpdateUser, validateDeleteUser } = require('../validations/userValidate');

router.route('/register').post(validateCreateUser, registerUser);
router.route('/login').post(validateLogin, loginUser);
router.route('/profile').post(isAuthenticated, validateUpdateUser, updateUserProfile);
router.route('/delete').delete(isAuthenticated, validateDeleteUser, deleteUser);

module.exports = router;
