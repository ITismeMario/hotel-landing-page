const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateToken } = require('../middlewares/auth');

const registerUser = asyncHandler(async (req, res) => {
	const { firstName, lastName, email, password, role } = req.body;

	const user = await User.create({
		firstName,
		lastName,
		email,
		password,
		role,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			role: user.role,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('An error has ocurred');
	}
});

module.exports = { registerUser };
