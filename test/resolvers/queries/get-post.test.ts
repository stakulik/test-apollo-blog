import { expect } from 'chai';
import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { createServer } from '../../../src/server';
import { AuthToken, Post, User } from '../../../src/models';
import {
  buildExecutionContext,
  buildRequestObject,
  executeServerOperation,
  generateToken,
} from '../../utils/resolvers';

const server = createServer();

const query = `
  query GetPost($id: UUID!) {
    getPost(id: $id) {
      id
      title
      author {
        id
      }
    }
  }
`;

const runQuery = async (variables, context) => executeServerOperation(server, query, variables, context);

describe(__filename, () => {
  let user;
  let post;
  let request;
  let executionContext;

  beforeEach(async () => {
    user = await factory.create<User>('User');

    post = await factory.create<Post>('Post', {
      user_id: user.id,
    });
    // another post
    await factory.create<Post>('Post');

    const token = generateToken(user);
    await factory.create<AuthToken>('AuthToken', {
      user_id: user.id,
      token,
    });

    request = buildRequestObject(token);

    executionContext = buildExecutionContext(user, request);
  });

  it("should succesfully return item's fields", async () => {
    const result = await runQuery({ id: post.id }, executionContext);

    const requestResult = result.body.singleResult;
    expect(_.pick(requestResult.data.getPost, [ 'id', 'title', 'author' ])).to.eql({
      id: post.id,
      title: post.title,
      author: {
        id: user.id,
      }
    });
    expect(requestResult.errors).to.be.undefined;
  });

  it('should succesfully return empty object', async () => {
    const result = await runQuery({ id: faker.string.uuid() }, executionContext);

    const requestResult = result.body.singleResult;
    expect(requestResult.data.getPost).to.be.null;
    expect(requestResult.errors).to.be.undefined;
  });

  context('when unauthorized', () => {
    it('should return error', async () => {
      executionContext = buildExecutionContext(null, request);

      const result = await runQuery({ id: post.id }, executionContext);

      expect(result.body.singleResult.errors[0].message).to.eql('You must authenticate');
    });
  });
});
