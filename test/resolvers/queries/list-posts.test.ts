import { expect } from 'chai';
import { factory } from 'factory-girl';
import _ from 'lodash';

import { createServer } from '../../../src/server';
import { sequelize } from '../../../src/db';
import { AuthToken, Post, User } from '../../../src/models';
import { defaultPageSize } from '../../../src/services/shared';
import {
  buildExecutionContext,
  buildOutcomeCursor,
  buildRequestObject,
  executeServerOperation,
  generateToken,
} from '../../utils/resolvers';
import { getEpochTime } from '../../utils/datetime';

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

const server = createServer();

const initialQuery = `
  query ListPosts($pageSize: Int) {
    listPosts(pageSize: $pageSize) {
      edges {
        id
        title
      }
      cursor
      lastPage
    }
  }
`;

const paginatedQuery = `
  query ListPosts($after: String) {
    listPosts(after: $after) {
      edges {
        id
        title
      }
      cursor
      lastPage
    }
  }
`;

const runQuery = async (query, variables, context) => executeServerOperation(server, query, variables, context);

describe(__filename, () => {
  let user;
  let post1: Post;
  let post2: Post;
  let post3: Post;
  let post4: Post;
  let request;
  let executionContext;

  beforeEach(async () => {
    user = await factory.create<User>('User');

    post1 = await factory.create<Post>('Post', {
      published_at: new Date('2025-03-01T00:00:00.000Z'),
    });
    post2 = await factory.create<Post>('Post', {
      published_at: new Date('2025-05-01T00:00:00.000Z'),
    });
    post3 = await factory.create<Post>('Post', {
      published_at: new Date('2024-02-01T00:00:00.000Z'),
    });
    post4 = await factory.create<Post>('Post', {
      published_at: new Date('2021-02-01T00:00:00.000Z'),
    });

    const token = generateToken(user);
    await factory.create<AuthToken>('AuthToken', {
      user_id: user.id,
      token,
    });

    request = buildRequestObject(token);

    executionContext = buildExecutionContext(user, request);
  });

  it('should return all ordered posts', async () => {
    const result = await runQuery(initialQuery, {}, executionContext);

    const requestResult = result.body.singleResult;
    expect(requestResult.data.listPosts.edges.map((p) => p.id)).to.eql([
      post2.id,
      post1.id,
      post3.id,
      post4.id,
    ]);
    expect(requestResult.data.listPosts.lastPage).to.be.true;

    const edgeEpochTime4 = await getEpochTimeForPost(post4.id);
    const cursor = await buildCursor(post4.id, edgeEpochTime4!, defaultPageSize);
    expect(requestResult.data.listPosts.cursor).to.eql(cursor);

    expect(requestResult.errors).to.be.undefined;
  });

  context('when pageSize supplied', () => {
    let result;
    let requestResult;
    let variables;
    let cursor;

    it('should return ordered posts', async () => {
      const post5 = await factory.create<Post>('Post');
      const post6 = await factory.create<Post>('Post');
      const post7 = await factory.create<Post>('Post');
      const post8 = await factory.create<Post>('Post');

      const pageSize = 3;
      variables = { pageSize };

      result = await runQuery(initialQuery, variables, executionContext);

      requestResult = result.body.singleResult.data.listPosts;
      expect(requestResult.edges.map((p) => p.id)).to.eql([
        post8.id,
        post7.id,
        post6.id,
      ]);
      expect(requestResult.lastPage).to.be.false;

      const edgeEpochTime6 = await getEpochTimeForPost(post6.id);
      cursor = await buildCursor(post6.id, edgeEpochTime6!, pageSize);
      expect(requestResult.cursor).to.eql(cursor);

      // second page
      variables = { after: requestResult.cursor };

      result = await runQuery(paginatedQuery, variables, executionContext);

      requestResult = result.body.singleResult.data.listPosts;
      expect(requestResult.edges.map((p) => p.id)).to.eql([
        post5.id,
        post2.id,
        post1.id,
      ]);
      expect(requestResult.lastPage).to.be.false;

      const edgeEpochTime1 = await getEpochTimeForPost(post1.id);
      cursor = await buildCursor(post1.id, edgeEpochTime1!, pageSize);
      expect(requestResult.cursor).to.eql(cursor);

      // third page
      variables = { after: requestResult.cursor };

      result = await runQuery(paginatedQuery, variables, executionContext);

      requestResult = result.body.singleResult.data.listPosts;
      expect(requestResult.edges.map((p) => p.id)).to.eql([
        post3.id,
        post4.id,
      ]);
      expect(requestResult.lastPage).to.be.true;

      const edgeEpochTime4 = await getEpochTimeForPost(post4.id);
      cursor = await buildCursor(post4.id, edgeEpochTime4!, pageSize);
      expect(requestResult.cursor).to.eql(cursor);
    });
  });

  context('when wrong cursor is provided', () => {
    it('should return error', async () => {
      const result = await runQuery(paginatedQuery, { after: 'abc' }, executionContext);

      expect(result.body.singleResult.errors).to.exist;
    });
  });

  context('when pageSize is wrong', () => {
    it('should return error', async () => {
      const result = await runQuery(initialQuery, { pageSize: defaultPageSize + 1 }, executionContext);

      expect(result.body.singleResult.errors).to.exist;
    });
  });

  context('when unauthorized', () => {
    it('should return error', async () => {
      executionContext = buildExecutionContext(null, request);

      const result = await runQuery(initialQuery, {}, executionContext);

      expect(result.body.singleResult.errors[0].message).to.eql('You must authenticate');
    });
  });
});
