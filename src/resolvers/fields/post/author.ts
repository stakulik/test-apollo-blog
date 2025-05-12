/* eslint-disable arrow-body-style */
import { batchResolver } from '../../helpers';
import { listAuthors } from '../../shared';

export const author = batchResolver(
  async (
    parents,
  ) => {
    return listAuthors(parents);
  },
);
