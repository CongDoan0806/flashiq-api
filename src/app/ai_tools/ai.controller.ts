import { Request, Response } from 'express';
import { generateText } from './ai.service';

export const generateStory = async (req: Request, res: Response) => {
  const setId = req.params.id;
  const { storyLength, style } = req.body;
  const result = await generateText(setId, storyLength, style);

  return res.status(200).json(result);
};
