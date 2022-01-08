const jwt = require('jsonwebtoken');

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

const isAuthenticated = (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
			next();
		} catch (error) {
			res.status(401);
			throw new Error('Unauthorized, Invalid token');
		}
	}

	if (!token) {
		res.status(401);
		throw new Error('Unauthorized, no token found');
	}
};

module.exports = { generateToken, isAuthenticated };
