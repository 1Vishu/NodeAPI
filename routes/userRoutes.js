const express = require('express');
const { signup, login, profile, update } = require('../controllers/userControllers');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/profile', profile);
router.post('/update/password', update);

module.exports = router;