import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type UserEvent = {
  eventType: string;
  userId: number;
  data: {
    user: {
      id: number;
      email: string;
      password: string;
    };
  };
};

export const saveUserHistory = async function (eventData: UserEvent) {
  try {
    await prisma.userHistory.create({
      data: {
        userId: eventData.userId,
        eventType: eventData.eventType,
        eventDetails: eventData.data.user,
      },
    });
  } catch (error) {
    console.error('Error saving user event:', error);
  }
};

export const getUserHistoryById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

  try {
    const skip = (page - 1) * pageSize;

    const userEvents = await prisma.userHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    });

    res.status(200).json(userEvents);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ error: 'Could not retrieve user events.' });
  }
};
