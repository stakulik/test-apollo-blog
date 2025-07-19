import _ from 'lodash';

import { CursorPayload, ListPostsParams } from '../../typings';
import { defaultPageSize } from '../constants';

import { PaginationCursor } from './pagination-cursor';

const decodeCursor = (
  cursor?: string,
): CursorPayload => {
  if (cursor) {
    return PaginationCursor.decode(cursor);
  }

  throw new Error('You must supply a cursor');
};

export const getCursorContent = (
  isFirstSearch: boolean,
  params: ListPostsParams,
): CursorPayload => {
  if (isFirstSearch) {
    const pageSize = _.isNil(params.pageSize) ? defaultPageSize : params.pageSize;

    if (pageSize > defaultPageSize) {
      throw new Error(`You can't request more than ${defaultPageSize} items per time`);
    }

    return {
      pageSize,
    };
  }

  return decodeCursor(
    params.after,
  );
};
