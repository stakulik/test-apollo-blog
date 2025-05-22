import _ from 'lodash';
import { QueryTypes } from 'sequelize';

import { sequelize } from '../db';
import { filterQueryOptions, PostRepository, QueryOptions } from '../repositories';

import { getCursorContent, edgeItemTimestamp, PaginationCursor } from './shared';
import { CrudService } from './crud.service';
import { ListPostsParams, ListPostsResult, PostListItem } from './typings';

const buildItemsQuery = (
  edgeItemTime?: string,
  edgeItemId?: string,
): string => {
  const conditions: string[] = [];

  const selectQuery = `
    SELECT
      p.*,
      p.published_at AS item_timestamp
    FROM posts AS p
  `;

  let certainTimeQuery: string | null = null;

  if (edgeItemTime && edgeItemId) {
    certainTimeQuery = `
      ${selectQuery}
      WHERE p.id IN (
        SELECT id
        FROM posts
        WHERE published_at = ${edgeItemTimestamp}
          AND id < :edgeItemId
      )
    `;

    conditions.push(
      'p.published_at < to_timestamp(:edgeItemTime)',
    );
  }

  const noCertainTimeCondition = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const noCertainTimeQuery = `
    ${selectQuery}
    ${noCertainTimeCondition}
  `;

  return _.compact([
    certainTimeQuery,
    noCertainTimeQuery,
  ]).join('\nUNION\n');
};

const buildQuery = (
  edgeItemTime?: string,
  edgeItemId?: string,
): string => {
  const innerQuery = buildItemsQuery(edgeItemTime, edgeItemId);

  return `
    SELECT
      *,
      EXTRACT(EPOCH FROM item_timestamp)::varchar AS epoch_time
    FROM (${innerQuery}) ps
    ORDER BY
      item_timestamp DESC,
      id DESC
    LIMIT :pageSize
  `;
};

export class PostService extends CrudService {
  constructor() {
    super(new PostRepository());
  }

  async list(
    params: ListPostsParams,
    options: QueryOptions = {},
  ): Promise<ListPostsResult> {
    const isFirstSearch = !params.after;

    const cursorContent = getCursorContent(isFirstSearch, params);

    const { edgeItemTime, edgeItemId, pageSize } = cursorContent;

    const sqlQuery = buildQuery(edgeItemTime, edgeItemId);
    const queryOptions = filterQueryOptions(options);

    const items = await sequelize.query<PostListItem>(
      sqlQuery,
      {
        raw: true,
        ...queryOptions,
        type: QueryTypes.SELECT,
        replacements: {
          edgeItemTime,
          edgeItemId,
          pageSize,
        },
      },
    );

    const edgeItem = items[items.length - 1];

    const lastPage = items.length < cursorContent.pageSize;
    cursorContent.edgeItemTime = edgeItem?.epoch_time;
    cursorContent.edgeItemId = edgeItem?.id;

    const cursor = PaginationCursor.encode(cursorContent);

    return {
      edges: items,
      cursor,
      lastPage,
    };
  }
}
