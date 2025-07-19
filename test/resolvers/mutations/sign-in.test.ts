import { expect } from 'chai';
import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { createServer } from '../../../src/server';
import { User } from '../../../src/models';
import { UserService,  } from '../../../src/services';
import {
  buildExecutionContext,
  executeServerOperation,
} from '../../utils/resolvers';

const server = createServer();

const mutation = `
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;

const runQuery = async (variables, context) => executeServerOperation(server, mutation, variables, context);

describe(__filename, () => {
  let userService;
  let user;
  let executionContext;
  let variables;

  beforeEach(async () => {
    const creationAttributes = await factory.attrs<User>('User', {
      password: faker.lorem.word(),
    });

    userService = new UserService();
    user = await userService.create(creationAttributes);

    executionContext = buildExecutionContext(null, {});

    variables = {
      email: creationAttributes.email,
      password: creationAttributes.password,
    };
  });

  it('should return token', async () => {
    const result = await runQuery(variables, executionContext);

    expect(result.body.singleResult.data.signIn).to.be.a.string;
    expect(result.body.singleResult.errors).to.be.undefined;
  });

  context('when wrong email', () => {
    it('should return null', async () => {
      const result = await runQuery({ ...variables, email: faker.internet.email() }, executionContext);

      expect(result.body.singleResult.data.signIn).to.be.null;
    });
  });

  context('when wrong password', () => {
    it('should return null', async () => {
      const result = await runQuery({ ...variables, password: faker.lorem.word() }, executionContext);

      expect(result.body.singleResult.data.signIn).to.be.null;
    });
  });
});
