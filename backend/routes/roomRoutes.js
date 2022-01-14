const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { createRoom, getRoom, getRooms, updateRoom } = require('../controllers/roomController');
const { validateCreateRoom, validateGetRoom, validateUpdateRoom } = require('../validations/roomValidate');

router.route('/create').post(validateCreateRoom, createRoom);
router.route('/:id').get(validateGetRoom, getRoom);
router.route('/').get(getRooms);
router.route('/:id').put(isAuthenticated, validateUpdateRoom, updateRoom);

module.exports = router;
