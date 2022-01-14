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

const getRoom = asyncHandler(async (req, res) => {
	try {
		const room = await Room.findById(req.params.id);

		if (room) res.status(201).json(room);
		else {
			res.status(404);
			throw new Error('Habitación no encontrada');
		}
	} catch (error) {
		if (error.name === 'CastError') throw new Error('El ID proporcionado no es válido');
		else throw new Error(error.message);
	}
});

const getRooms = asyncHandler(async (req, res) => {
	try {
		const rooms = await Room.find();
		res.status(201).json(rooms);
	} catch (error) {
		throw new Error(error.message);
	}
});

const updateRoom = asyncHandler(async (req, res) => {
	try {
		const room = await Room.findById(req.params.id);
		if (room) {
			room.name = req.body.name || room.name;
			room.images = req.body.images || room.images;
			room.description = req.body.description || room.description;
			room.price = req.body.price || room.price;
			room.details = req.body.details || room.details;
			room.amenities = req.body.amenities || room.amenities;

			const updatedRoom = await room.save();
			updatedRoom.message = 'Se ha creado la habitación';
			res.status(201).json(updatedRoom);
		} else {
			res.status(404);
			throw new Error('No se encontró la habitación');
		}
	} catch (error) {
		throw new Error(error.message);
	}
});

module.exports = { createRoom, getRoom, getRooms, updateRoom };
