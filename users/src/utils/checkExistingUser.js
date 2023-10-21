const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkExistingUserByEmail = async (email) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return existingUser;
};

const checkExistingUserById = async (id) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return existingUser;
};

module.exports = { checkExistingUserByEmail, checkExistingUserById };
