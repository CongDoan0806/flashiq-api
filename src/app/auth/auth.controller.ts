import { Request, Response } from 'express';
import { createUser, findByEmail } from './auth.service';
import { RegisterDto } from './auth.dto';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const user = await findByEmail(email);
    if (user) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }
    const newUser = await createUser(email, password, username);
    if (!newUser) {
      return res.status(400).json({
        message: 'User not created',
      });
    }
    const userResponse: RegisterDto = {
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
    return res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: (error as Error).message,
    });
  }
};
