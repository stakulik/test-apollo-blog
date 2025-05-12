/* eslint-disable arrow-body-style */
import { batchResolver, listAuthors } from '../../shared';

export const author = batchResolver(
  async (
    parents,
  ) => {
    return listAuthors(parents);
  },
);
