import { BaseException } from '../../errors/BaseException';
import { AccessRepository } from './access.repository';
import { SetRepository } from '../sets/set.repository';
import { ShareSetDto } from './access.dto';
import { prisma } from '../../utils/prisma';

export const AccessService = {
  async shareSet(currentUserId: string, data: ShareSetDto) {
    const set = await SetRepository.findById(data.setId, false);
    if (!set) throw new BaseException(404, 'Set not found');

    if (set.ownerId !== currentUserId) {
      throw new BaseException(403, 'Only the owner can share this set');
    }

    if (data.userId === currentUserId) {
      throw new BaseException(400, 'You cannot share the set with yourself');
    }

    return await AccessRepository.grantAccess(data);
  },

  async getAllInforShared(setId: string, currentUserId: string) {
    const set = await SetRepository.findById(setId, false);
    if (!set) throw new BaseException(404, 'Set not found');

    if (set.ownerId !== currentUserId) {
      throw new BaseException(403, 'Permission denied');
    }

    return await AccessRepository.getSetShared(setId);
  },

  async revokeAccess(accessId: string, currentUserId: string) {
    const access = await prisma.access.findUnique({
      where: { id: accessId },
      include: { set: true },
    });

    if (!access) throw new BaseException(404, 'Access record not found');
    if (access.set.ownerId !== currentUserId) {
      throw new BaseException(403, 'Only the owner can revoke access');
    }

    return await AccessRepository.revokeAccess(accessId);
  },
};
