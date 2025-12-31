import { Request, Response } from 'express';
import {
  extractPayloadFromAccessToken,
  getAccessTokenFromHeader,
} from '../../utils/jwtHelper';
import { SetService } from './set.service';

export const SetController = {
  getUserId(req: Request) {
    const token = getAccessTokenFromHeader(req);
    return extractPayloadFromAccessToken(token)?.id;
  },

  async create(req: Request, res: Response) {
    try {
      const ownerId = SetController.getUserId(req);
      const data = await SetService.createSet({ ...req.body, ownerId });
      return res
        .status(201)
        .json({ message: 'Created set successfully', data });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      return res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
      });
    }
  },

  async getSetByUser(req: Request, res: Response) {
    try {
      const currentUserId = SetController.getUserId(req);
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await SetService.findByUserId(
        currentUserId,
        userId,
        page,
        limit
      );
      return res
        .status(200)
        .json({ message: 'Data retrieved successfully', ...result });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      return res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const includeCards = req.query.includeCards === 'true';
      const currentUserId = SetController.getUserId(req);

      const data = await SetService.findById(id, includeCards, currentUserId);
      return res.status(200).json(data);
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      return res.status(err.status || 500).json({ message: err.message });
    }
  },

  async updateSet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const currentUserId = SetController.getUserId(req);
      const data = await SetService.updateSet(id, currentUserId, req.body);
      return res.status(200).json({ message: 'Updated successfully', data });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      return res.status(err.status || 500).json({ message: err.message });
    }
  },

  async deleteSet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const currentUserId = SetController.getUserId(req);

      if (!currentUserId)
        return res.status(401).json({ message: 'Unauthorized' });

      const deletedSet = await SetService.deleteSet(id, currentUserId);
      return res.status(200).json({
        message: `Deleted the set ${deletedSet.title} successfully`,
        data: null,
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      return res.status(err.status || 500).json({ message: err.message });
    }
  },

  async search(req: Request, res: Response) {
    try {
      const keyword = req.query.q as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const response = await SetService.searchSets(keyword, page, limit);
      return res.status(200).json(response);
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      return res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getTrending(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await SetService.getTrendingSets(page, limit);
      return res
        .status(200)
        .json({ message: 'Trending sets retrieved successfully', ...data });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      return res.status(err.status || 500).json({ message: err.message });
    }
  },
};
