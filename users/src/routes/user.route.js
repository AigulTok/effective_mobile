const express = require('express');
const router = express();

const { createUser, updateUser, getAllUsers } = require('../controllers/user.controller');
const validateUser = require('../middlewares/userValidation');

router.post('/users', validateUser, createUser);
router.put('/users/:userId', validateUser, updateUser);
router.get('/users', getAllUsers);

module.exports = router;
