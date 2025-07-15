import { prisma } from "./index.js";

export const createMatch = async (user1Id: string, user2Id: string) => {
  return await prisma.match.create({
    data: {
      user1Id,
      user2Id,
    },
  });
};

export const getMatchesByUser = async (userId: string) => {
  return await prisma.match.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
  });
};
