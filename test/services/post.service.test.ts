import { expect } from 'chai';
import { factory } from 'factory-girl';
import _ from 'lodash';

import { sequelize } from '../../src/db';
import { Post } from '../../src/models';
import { PostService } from '../../src/services';
import { defaultPageSize } from '../../src/services/shared';
import { getEpochTime } from '../utils/datetime';
import { buildOutcomeCursor } from '../utils/resolvers';

const buildCursor = async (
  edgeItemId?: string,
  epochTime?: string,
  pageSize?: Number,
) => {
  const payload = {
    pageSize,
    edgeItemTime: epochTime,
    edgeItemId,
  };

  return buildOutcomeCursor(payload);
};

const getEpochTimeForPost = async (postId) => getEpochTime(
  Post.tableName,
  'published_at',
  postId,
  { sequelize },
);

const pickAttributes = (item) => _.pick(item, ['id', 'epoch_time']);

describe(__filename, () => {
  let postSerice;

  beforeEach(async () => {
    postSerice = new PostService();
  });

  describe('#list', () => {
    let post1: Post;
    let post2: Post;
    let post3: Post;

    const runTest = async (params) => (
      await postSerice.list(params)
    );

    beforeEach(async () => {
      post1 = await factory.create<Post>('Post', {
        published_at: new Date('2025-03-01T00:00:00.000Z'),
      });
      post2 = await factory.create<Post>('Post', {
        published_at: new Date('2025-05-01T00:00:00.000Z'),
      });
      post3 = await factory.create<Post>('Post', {
        published_at: new Date('2024-02-01T00:00:00.000Z'),
      });
    });

    it('should return ordered posts', async () => {
      const params = {
        pageSize: 3,
      };

      const result = await runTest(params);

      const edgeEpochTime2 = await getEpochTimeForPost(post2.id);
      expect(pickAttributes(result.edges[0])).to.eql({
        id: post2.id,
        epoch_time: edgeEpochTime2,
      });

      const edgeEpochTime1 = await getEpochTimeForPost(post1.id);
      expect(pickAttributes(result.edges[1])).to.eql({
        id: post1.id,
        epoch_time: edgeEpochTime1,
      });

      const edgeEpochTime3 = await getEpochTimeForPost(post3.id);
      expect(pickAttributes(result.edges[2])).to.eql({
        id: post3.id,
        epoch_time: edgeEpochTime3,
      });

      const cursor = await buildCursor(post3.id, edgeEpochTime3!, params.pageSize);
      expect(result.cursor).to.eql(cursor);
    });

    context('when edgeItem attributes supplied', () => {
      let post4: Post;
      let post5: Post;

      beforeEach(async () => {
        post4 = await factory.create<Post>('Post', {
          published_at: new Date('2022-01-01T00:00:00.000Z'),
        });
        post5 = await factory.create<Post>('Post', {
          published_at: new Date('2023-01-01T00:00:00.000Z'),
        });
      });

      it('should return ordered posts', async () => {
        const edgeEpochTime2 = await getEpochTimeForPost(post2.id);
        const pageSize = 4;
        const after = await buildCursor(post2.id, edgeEpochTime2!, pageSize);

        const params = {
          after,
        };

        const result = await runTest(params);

        const edgeEpochTime1 = await getEpochTimeForPost(post1.id);
        expect(pickAttributes(result.edges[0])).to.eql({
          id: post1.id,
          epoch_time: edgeEpochTime1,
        });

        const edgeEpochTime3 = await getEpochTimeForPost(post3.id);
        expect(pickAttributes(result.edges[1])).to.eql({
          id: post3.id,
          epoch_time: edgeEpochTime3,
        });

        const edgeEpochTime5 = await getEpochTimeForPost(post5.id);
        expect(pickAttributes(result.edges[2])).to.eql({
          id: post5.id,
          epoch_time: edgeEpochTime5,
        });

        const edgeEpochTime4 = await getEpochTimeForPost(post4.id);
        expect(pickAttributes(result.edges[3])).to.eql({
          id: post4.id,
          epoch_time: edgeEpochTime4,
        });

        const cursor = await buildCursor(post4.id, edgeEpochTime4!, pageSize);
        expect(result.cursor).to.eql(cursor);

        expect(result.lastPage).to.be.false;
      });

      context('when there are no more items', () => {
        it('should return an empty array', async () => {
          const edgeEpochTime4 = await getEpochTimeForPost(post4.id);
          const after = await buildCursor(post4.id, edgeEpochTime4!, defaultPageSize);

          const params = {
            after,
          };

          const result = await runTest(params);

          const cursor = await buildCursor(undefined, undefined, defaultPageSize);
          expect(result).to.eql({
            edges: [],
            cursor,
            lastPage: true,
          });
        });
      });
    });
  });
});
