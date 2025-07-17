import { Media, MediaCreateInput } from '@repo/types';
import { prisma } from './index.js';

/**
 * Save data of a media uploaded to a provider like imgur.
 * @param input Media data.
 * @returns Stored media object.
 */
export async function createMedia(input: MediaCreateInput[]): Promise<Media[]> {
  return await prisma.media.createManyAndReturn({
    data: input,
  });
}
