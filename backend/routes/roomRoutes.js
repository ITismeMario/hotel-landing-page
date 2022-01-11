const express = require('express');
const router = express.Router();
const { createRoom } = require('../controllers/roomController');
const { validateCreateRoom } = require('../validations/roomValidate');

router.route('/create').post(validateCreateRoom, createRoom);

module.exports = router;
