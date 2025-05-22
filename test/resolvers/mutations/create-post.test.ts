import { expect } from 'chai';
import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { createServer } from '../../../src/server';
import { AuthToken, User } from '../../../src/models';
import {
  buildExecutionContext,
  buildRequestObject,
  executeServerOperation,
  generateToken,
} from '../../utils/resolvers';

const server = createServer();

const mutation = `
  mutation CreatePost($title: String!, $body: String!, $publishedAt: DateTimeISO) {
    createPost(title: $title, body: $body, published_at: $publishedAt) {
      title
      body
      published_at
      author {
        id
      }
    }
  }
`;

const runQuery = async (variables, context) => executeServerOperation(server, mutation, variables, context);

describe(__filename, () => {
  let user;
  let request;
  let executionContext;
  let variables;

  beforeEach(async () => {
    user = await factory.create<User>('User');

    const token = generateToken(user);
    await factory.create<AuthToken>('AuthToken', {
      user_id: user.id,
      token,
    });

    request = buildRequestObject(token);

    executionContext = buildExecutionContext(user, request);

    variables = {
      title: faker.lorem.sentence(),
      body: faker.lorem.sentence(),
      publishedAt: '2025-05-22T12:46:27.081Z'
    }
  });

  it('should create post', async () => {
    const result = await runQuery(variables, executionContext);

    const requestResult = result.body.singleResult;
    expect(_.pick(requestResult.data.createPost, [ 'title', 'body', 'published_at', 'author' ])).to.eql({
      title: variables.title,
      body: variables.body,
      published_at: variables.publishedAt,
      author: {
        id: user.id,
      }
    });
    expect(requestResult.errors).to.be.undefined;
  });

  context('when title is empty', () => {
    it('should return error', async () => {
      const result = await runQuery({ ...variables, title: ''}, executionContext);

      expect(result.body.singleResult.errors).to.exist
    });
  });

  context('when unauthorized', () => {
    it('should return error', async () => {
      executionContext = buildExecutionContext(null, request);

      const result = await runQuery(variables, executionContext);

      expect(result.body.singleResult.errors[0].message).to.eql('You must authenticate');
    });
  });
});
