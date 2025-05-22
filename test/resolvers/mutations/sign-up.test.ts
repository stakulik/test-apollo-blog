import { expect } from 'chai';
import { factory } from 'factory-girl';
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
  mutation SignUp($email: String!, $nickname: String!, $password: String!) {
    signUp(email: $email, nickname: $nickname, password: $password)
  }
`;

const runQuery = async (variables, context) => executeServerOperation(server, mutation, variables, context);

describe(__filename, () => {
  let creationAttributes;
  let executionContext;
  let variables;
  let userService;

  beforeEach(async () => {
    creationAttributes = await factory.attrs<User>('User', {
      password: 'some-password',
    });

    executionContext = buildExecutionContext(null, {});

    variables = {
      email: creationAttributes.email,
      nickname: creationAttributes.nickname,
      password: creationAttributes.password,
    };

    userService = new UserService();
  });

  it('should return true', async () => {
    const result = await runQuery(variables, executionContext);

    expect(result.body.singleResult.data.signUp).to.be.true;
    expect(result.body.singleResult.errors).to.be.undefined;
  });

  it('should create user', async () => {
    await runQuery(variables, executionContext);

    const user = await userService.getByCriteria({ email: creationAttributes.email });
    expect(user).to.exist;
  });

  context('when wrong email', () => {
    it('should return error', async () => {
      const anotherUser = await factory.create<User>('User');

      const result = await runQuery({ ...variables, nickname: anotherUser.nickname }, executionContext);

      expect(result.body.singleResult.errors[0].message).to.eql('Email or nickname has already been taken');
    });
  });
});
