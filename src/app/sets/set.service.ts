import { BaseSuccessResponse } from '../../dto/SuccessResponse';
import { BaseException } from '../../errors/BaseException';
import { CreateSetDto } from './set.dto';
import { SetRepository } from './set.repository';

export const SetService = {
  async createSet(data: CreateSetDto & { ownerId: string }) {
    return await SetRepository.createSet(data);
  },

  async findByUserId(
    currentUserId: string,
    targetUserId: string,
    page: number,
    limit: number
  ) {
    if (currentUserId !== targetUserId) {
      throw new BaseException(
        403,
        'You do not have permission to view this data'
      );
    }
    const result = await SetRepository.findByUserId(targetUserId, page, limit);
    const totalPages = Math.ceil(result.totalItems / limit);
    return {
      sets: result.sets,
      totalItems: result.totalItems,
      totalPages: totalPages,
      currentPage: page,
    };
  },

  async findById(
    id: string,
    includeCards: boolean = false,
    currentUserId?: string
  ) {
    const set = await SetRepository.findById(id, includeCards);
    if (!set) {
      throw new BaseException(
        404,
        `Resource not found: Set with id ${id} does not exist`
      );
    }
    const isOwner =
      currentUserId && String(currentUserId) === String(set.ownerId);
    if (!isOwner) {
      try {
        await SetRepository.incrementViewCount(id);
        set.viewCount += 1;
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    }
    return new BaseSuccessResponse('Get the set of success', set);
  },

  async updateSet(
    setId: string,
    currentUserId: string,
    data: Partial<CreateSetDto>
  ) {
    const existingSet = await SetRepository.findById(setId, false);
    if (!existingSet) {
      throw new BaseException(404, 'Set not found');
    }
    if (existingSet.ownerId !== currentUserId) {
      throw new BaseException(
        403,
        'You do not have permission to update this set'
      );
    }
    return await SetRepository.updateSet(setId, data);
  },

  async deleteSet(setId: string, currentUserId: string) {
    const existingSet = await SetRepository.findById(setId, false);
    if (!existingSet) {
      throw new BaseException(404, 'Set not found');
    }
    if (existingSet.ownerId !== currentUserId) {
      throw new BaseException(
        403,
        'You do not have permission to delete this set'
      );
    }
    const deletedSet = await SetRepository.deleteSet(setId);
    return deletedSet;
  },

  async searchSets(keyword: string, page: number, limit: number) {
    if (!keyword || keyword.trim() === '') {
      return new BaseSuccessResponse('No sets found matching your search', {
        sets: [],
        pagination: { totalItems: 0, totalPages: 0, currentPage: page, limit },
      });
    }
    const { sets, totalItems } = await SetRepository.findByTitle(
      keyword,
      page,
      limit
    );
    const totalPages = Math.ceil(totalItems / limit);
    const data = {
      sets,
      pagination: { totalItems, totalPages, currentPage: page, limit },
    };
    return new BaseSuccessResponse('Sets retrieved successfully', data);
  },

  async getTrendingSets(page: number, limit: number) {
    try {
      const result = await SetRepository.findTopViewed(page, limit);
      return {
        sets: result.sets,
        pagination: {
          totalItems: result.totalItems,
          totalPages: result.totalPages,
          currentPage: page,
          limit: limit,
        },
      };
    } catch (_error) {
      throw new BaseException(500, 'Failed to retrieve trending sets');
    }
  },
};
