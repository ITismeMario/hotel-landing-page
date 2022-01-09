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

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (user && (await user.isValidPassword(password))) {
		res.json({
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid email or password');
	}
});

const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.firstName = req.body.firstName || user.firstName;
		user.lastName = req.body.lastName || user.lastName;
		user.email = req.body.email || user.email;
		user.role = req.body.role || user.role;

		if (req.body.password) user.password = req.body.password;

		try {
			const updatedUser = await user.save();

			res.json({
				_id: updatedUser._id,
				firstName: updatedUser.firstName,
				lastName: updatedUser.lastName,
				email: updatedUser.email,
				role: updatedUser.role,
				token: generateToken(updatedUser._id),
			});
		} catch (error) {
			throw new Error('The data could not be updated');
		}
	} else {
		res.status(400);
		throw new Error('User not found');
	}
});

const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		const userId = user._id.toString();
		try {
			await User.findByIdAndDelete(userId);
			res.status(200).json({ Id: userId, message: 'Account deleted successfully' });
		} catch (err) {
			return res.status(403).json(err);
		}
	} else return res.status(404).json('No account matched the data');
});

module.exports = { registerUser, loginUser, updateUserProfile, deleteUser };
