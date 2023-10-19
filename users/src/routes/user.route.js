const express = require('express');
const router = express();

const { createUser, updateUser, getAllUsers } = require('../controllers/user.controller');

router.post('/users', createUser);
router.put('/users/:userId', updateUser);
router.get('/users', getAllUsers);

module.exports = router;
