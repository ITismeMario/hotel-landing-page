const asyncHandler = require('express-async-handler');
const Room = require('../models/roomModel');

const createRoom = asyncHandler(async (req, res) => {
	const { name, images, description, price, details, services } = req.body;

	const room = await Room.create({
		name,
		images,
		description,
		price,
		details,
		services,
	});

	if (room) {
		res.status(201).json({
			id: room._id,
			name: room.name,
			images: room.images,
			description: room.description,
			price: room.price,
			details: room.details,
			services: room.services,
		});
	} else {
		res.status(400);
		throw new Error('The room could not be created');
	}
});

module.exports = { createRoom };
