const User = require('../models/userModel');
const { check, header, body } = require('express-validator');
const { validateResult } = require('../helpers/validationHelper');
const jwt = require('jsonwebtoken');

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

const validateLogin = [
	check('email').exists({ checkFalsy: true }).withMessage('You need to provide an e-mail'),
	check('password').exists({ checkFalsy: true }).withMessage('You need to provide a password'),
	(req, res, next) => {
		validateResult(req, res, next);
	},
];

const validateUpdateUser = [
	header('Authorization')
		.exists()
		.withMessage('No token')
		.customSanitizer((authorization) => {
			let sanitizedToken = authorization.split(' ')[1];
			return sanitizedToken;
		})
		.isJWT()
		.withMessage('No valid token was recieved'),
	check('firstName')
		.exists()
		.withMessage('You need enter your first name')
		.isLength({ min: 2 })
		.withMessage('The field First Name must be at least 2 digits long'),
	check('lastName', '')
		.exists()
		.withMessage('You need enter your last name')
		.isLength({ min: 2 })
		.withMessage('The field Last Name must be at least 2 digits long'),
	check('email')
		.exists()
		.withMessage('You need enter an email')
		.bail()
		.isEmail()
		.normalizeEmail()
		.custom(async (email, { req }) => {
			//Getting the id from the JWT and compare if the requester.id an the user with the email (already in use) are the same person
			let token = req.headers.authorization; //Previously sanitized above

			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
			if (!decodedToken) throw new Error('The recieved token is corrupt');

			const userWithThatEmail = await User.findOne({ email });
			if (userWithThatEmail && userWithThatEmail._id.toString() !== decodedToken.id.toString()) {
				throw new Error('That email is unavailable');
			}
			return true;
		})
		.withMessage('That email is in use by another user')
		.bail(),
	check('password')
		.exists()
		.withMessage('You need to enter a password')
		.isStrongPassword()
		.withMessage(
			'The password must be at least 8 digits long and contain at least 1 of each of the following type of digits: lowercase,  uppercase, number, symbols'
		),
	check('role').exists().isIn(['user', 'admin']).withMessage('Invalid role'),
	(req, res, next) => {
		validateResult(req, res, next);
	},
];

module.exports = { validateCreateUser, validateLogin, validateUpdateUser };
