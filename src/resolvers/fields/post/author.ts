/* eslint-disable arrow-body-style */
import { Post, User } from '../../../models';
import { batchResolver, listAuthors } from '../../shared';

export const author = batchResolver(
  async (
    parents: Post[],
  ): Promise<User[]> => {
    return listAuthors(parents);
  },
);
