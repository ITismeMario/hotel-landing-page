const express = require('express');
const router = express.Router();
const { createRoom, getRoom, getRooms } = require('../controllers/roomController');
const { validateCreateRoom, validateGetRoom } = require('../validations/roomValidate');

router.route('/create').post(validateCreateRoom, createRoom);
router.route('/:id').get(validateGetRoom, getRoom);
router.route('/').get(getRooms);
module.exports = router;
