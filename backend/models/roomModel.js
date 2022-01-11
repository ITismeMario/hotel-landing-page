const mongoose = require('mongoose');

const roomDetailsSchema = new mongoose.Schema({
	room_details_icon: { type: String, required: true },
	room_details_description: { type: String, required: true },
});

const roomAmenitiesSchema = new mongoose.Schema({
	room_amenities_icon: { type: String, required: true },
	room_amenities_description: { type: String, required: true },
});

const roomSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		images: { type: Array, required: true },
		description: { type: String, required: true },
		price: { type: Number },
		details: [roomDetailsSchema],
		amenities: [roomAmenitiesSchema],
	},
	{ timestamps: true }
);

const Room = mongoose.model('room', roomSchema);
module.exports = Room;
