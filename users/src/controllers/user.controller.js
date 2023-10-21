require('dotenv').config();
const rabbitmq = require('../rabbitmq');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { checkExistingUserByEmail, checkExistingUserById } = require('../utils/checkExistingUser');
const { StatusCodes } = require('http-status-codes');

const createUser = async (req, res) => {
  const existingUser = await checkExistingUserByEmail(req.body.email);

  if (existingUser) {
    return res.status(StatusCodes.CONFLICT).json({ error: 'User with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hashedPassword,
    },
  });

  rabbitmq.publishUserEvent('user.created', newUser.id, { user: newUser });

  res.status(StatusCodes.CREATED).json(newUser);
};

const updateUser = async (req, res) => {
  let userId = req.params.userId;

  if (!/^\d+$/.test(userId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid userId format' });
  }

  userId = parseInt(userId, 10);

  const userData = req.body;

  const existingUser = await checkExistingUserById(userId);

  if (!existingUser) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
  }

  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: userData,
  });

  rabbitmq.publishUserEvent('user.updated', updatedUser.id, { user: updatedUser });

  res.status(StatusCodes.OK).json(updatedUser);
};

const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(StatusCodes.OK).json(users);
};

module.exports = { createUser, updateUser, getAllUsers };
