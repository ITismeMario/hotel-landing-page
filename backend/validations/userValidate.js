const User = require('../models/userModel');
const { check, header } = require('express-validator');
const { validateResult } = require('../helpers/validationHelper');

const validateCreateUser = [
	check('firstName')
		.exists()
		.withMessage('You need enter your first name')
		.isLength({ min: 2 })
		.withMessage('FirstName must be at least 2 digits long'),
	check('lastName', '')
		.exists()
		.withMessage('You need enter your last name')
		.isLength({ min: 2 })
		.withMessage('LastName must be at least 2 digits long'),
	check('email')
		.exists()
		.withMessage('You need enter an email')
		.bail()
		.isEmail()
		.normalizeEmail()
		.custom(async (email) => {
			const userExists = await User.findOne({ email });
			if (userExists) throw new Error('That e-mail is already in use');
			else return true;
		})
		.withMessage('That e-mail is already in use')
		.bail(),
	check('password')
		.exists()
		.withMessage('You need to enter a password')
		.isStrongPassword()
		.withMessage(
			'The password must be at least 8 digits long and contain at least 1 of each of the following type of digits: lowercase,  uppercase, number, symbols'
		),
	(req, res, next) => {
		validateResult(req, res, next);
	},
];

module.exports = { validateCreateUser };
