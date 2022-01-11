const asyncHandler = require('express-async-handler');
const Room = require('../models/roomModel');

const createRoom = asyncHandler(async (req, res) => {
	const { name, images, description, price, details, amenities, services } = req.body;

	const room = await Room.create({
		name,
		images,
		description,
		price,
		details,
		amenities,
		services,
	});

	if (room) {
		res.status(201).json({
			_id: room._id,
			name: room.name,
			images: room.images,
			description: room.description,
			price: room.price,
			details: room.details,
			amenities: room.amenities,
			services: room.services,
		});
	} else {
		res.status(400);
		throw new Error('The room could not be created');
	}
});

module.exports = { createRoom };
