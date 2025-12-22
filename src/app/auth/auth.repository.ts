import { prisma } from '../../utils/prisma';

export const findByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
};

export const createUser = async (
  email: string,
  password: string,
  name: string,
  avatar: string = ''
) => {
  const user = await prisma.user.create({
    data: {
      email: email,
      password: password,
      username: name,
      avatar: avatar,
    },
  });
  return user;
};
