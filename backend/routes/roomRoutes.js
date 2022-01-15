const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { createRoom, getRoom, getRooms, updateRoom, deleteRoom } = require('../controllers/roomController');
const { validateCreateRoom, validateGetRoom, validateUpdateRoom, validateDeleteUser } = require('../validations/roomValidate');

router.route('/').post(isAuthenticated, validateCreateRoom, createRoom);
router
	.route('/:id')
	.get(validateGetRoom, getRoom)
	.put(isAuthenticated, validateUpdateRoom, updateRoom)
	.delete(isAuthenticated, validateDeleteUser, deleteRoom);
router.route('/').get(getRooms);

module.exports = router;
