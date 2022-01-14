const Room = require('../models/roomModel');
const { check, param, header } = require('express-validator');
const { validateResult } = require('../helpers/validationHelper');

/**
 * Validates if every image/icon in the array has the allowed extensions
 * @param {Array} images
 * @param {Array} allowedExtensions
 * @returns {Boolean} Returns 1 single boolean
 */
function validateImages(images, allowedExtensions) {
	let validations = images.map((currentImg) => {
		let fileExtension = currentImg.split('.').pop();

		if (!allowedExtensions.includes(fileExtension)) {
			return false;
		}
		return true;
	});

	if (validations.includes(false)) {
		return false;
	} else return true;
}

const validateCreateRoom = [
	check('name')
		.exists()
		.withMessage('Es necesario asignar un nombre para el tipo de habitación')
		.isLength({ min: 5 })
		.withMessage('El nombre debe contener por lo menos 5 caracteres')
		.custom(async (name) => {
			const roomExists = await Room.findOne({ name });
			if (roomExists) throw new Error('Ese nombre de habitación ya está en uso');
			else return true;
		}),
	check('images')
		.exists()
		.custom((images) => validateImages(images, ['jpg', 'jpeg', 'png']))
		.withMessage('Solo imagenes con la extensión .jpg .jpeg o .png son aceptadas'),
	check('description').exists().withMessage('Debe proporcionar una descripción para la habitación'),
	check('price').optional().isNumeric().withMessage('Este campo solo acepta números y punto'),
	check('details').exists().withMessage('Debe de proporcionar los detalles de la habitación').bail(),
	check('details') //validating the "room_details_icon"
		.custom((details) => {
			let images = details.map((element) => element.room_details_icon);
			return validateImages(images, ['png', 'svg']);
		})
		.withMessage('Solo imagenes con la extensión .svg o .png son aceptadas'),
	check('amenities').exists().withMessage('Debe de proporcionar los detalles de la habitación').bail(),
	check('amenities') //validating the "room_amenities_icon"
		.custom((amenities) => {
			let images = amenities.map((element) => element.room_amenities_icon);
			return validateImages(images, ['png', 'svg']);
		})
		.withMessage('Solo imagenes con la extensión .svg o .png son aceptadas'),
	(req, res, next) => {
		validateResult(req, res, next);
	},
];

const validateGetRoom = [
	param('id').exists().withMessage('Debe de proporcionar un Id').isMongoId().withMessage('Id inválido'), //403
	(req, res, next) => {
		validateResult(req, res, next);
	},
];

const validateUpdateRoom = [
	header('Authorization')
		.exists()
		.withMessage('No token')
		.customSanitizer((authorization) => {
			let sanitizedToken = authorization.split(' ')[1];
			return sanitizedToken;
		})
		.isJWT()
		.withMessage('No valid token was recieved'),
	check('name')
		.exists()
		.withMessage('Es necesario asignar un nombre para el tipo de habitación')
		.isLength({ min: 5 })
		.withMessage('El nombre debe contener por lo menos 5 caracteres')
		.custom(async (name) => {
			const roomExists = await Room.findOne({ name });
			if (roomExists) throw new Error('Ese nombre de habitación ya está en uso');
			else return true;
		}),
	check('images')
		.exists()
		.custom((images) => validateImages(images, ['jpg', 'jpeg', 'png']))
		.withMessage('Solo imagenes con la extensión .jpg .jpeg o .png son aceptadas'),
	check('description').exists().withMessage('Debe proporcionar una descripción para la habitación'),
	check('price').optional().isNumeric().withMessage('Este campo solo acepta números y punto'),
	check('details').exists().withMessage('Debe de proporcionar los detalles de la habitación').bail(),
	check('details') //validating the "room_details_icon"
		.custom((details) => {
			let images = details.map((element) => element.room_details_icon);
			return validateImages(images, ['png', 'svg']);
		})
		.withMessage('Solo imagenes con la extensión .svg o .png son aceptadas'),
	check('amenities').exists().withMessage('Debe de proporcionar los detalles de la habitación').bail(),
	check('amenities') //validating the "room_amenities_icon"
		.custom((amenities) => {
			let images = amenities.map((element) => element.room_amenities_icon);
			return validateImages(images, ['png', 'svg']);
		})
		.withMessage('Solo imagenes con la extensión .svg o .png son aceptadas'),
	(req, res, next) => {
		validateResult(req, res, next);
	},
];

module.exports = { validateCreateRoom, validateGetRoom, validateUpdateRoom };
