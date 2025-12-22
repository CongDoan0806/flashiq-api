import {
  findByEmail as findUserByEmail,
  createUser as createNewUser,
} from './auth.repository';
import bcrypt from 'bcrypt';
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const findByEmail = async (email: string) => {
  const user = await findUserByEmail(email);
  return user;
};

export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await createNewUser(email, hashedPassword, name);
  return user;
};
