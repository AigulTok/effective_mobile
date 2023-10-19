require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async (req, res) => {
  try {
    const newUser = await prisma.user.create({
      data: req.body,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create the user.' });
  }
};

const updateUser = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const userData = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update the user.' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not retrieve users.' });
  }
};

module.exports = { createUser, updateUser, getAllUsers };
