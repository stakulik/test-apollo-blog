import { expect } from 'chai';
import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';

import { createServer } from '../../../src/server';
import { User } from '../../../src/models';
import { AuthService, getHash, UserService } from '../../../src/services';
import { appConfig } from '../../../src/config';
import {
  buildExecutionContext,
  buildRequestObject,
  executeServerOperation,
} from '../../utils/resolvers';

const server = createServer();

const mutation = `
  mutation SignOut {
    signOut
  }
`;

const runQuery = async (context) => executeServerOperation(server, mutation, {}, context);

describe(__filename, () => {
  let userService: UserService;
  let authService: AuthService;
  let user: User;
  let password: string;
  let validToken: string;

  beforeEach(async () => {
    userService = new UserService();
    authService = new AuthService();

    password = faker.lorem.word();
    const hashedPassword = await getHash(password);
    user = await factory.create<User>('User', {
      password: hashedPassword,
    });

    const signInResult = await authService.signIn({
      email: user.email,
      password,
    });
    validToken = signInResult?.token!;
  });

  it('should return true and invalidate token', async () => {
    const requestObject = buildRequestObject(validToken);
    const executionContext = buildExecutionContext(null, requestObject);

    const result = await runQuery(executionContext);

    expect(result.body.singleResult.data.signOut).to.be.true;
    expect(result.body.singleResult.errors).to.be.undefined;

    const validateResult = await authService.validateToken(validToken);
    expect(validateResult).to.be.null;
  });

  describe('when token is expired', () => {
    it('should return true for expired token', async () => {
      const payload = { user_data: { email: user.email } };
      const expiredToken = jwt.sign(payload, appConfig.jwt.secret, { expiresIn: '0s' });

      const requestObject = buildRequestObject(expiredToken);
      const executionContext = buildExecutionContext(null, requestObject);

      const result = await runQuery(executionContext);

      expect(result.body.singleResult.data.signOut).to.be.true;
      expect(result.body.singleResult.errors).to.be.undefined;
    });

    it('should handle expired token from real session', async () => {
      const signInResult = await authService.signIn({
        email: user.email,
        password,
      });
      const originalToken = signInResult?.token!;

      const decodedPayload = jwt.decode(originalToken) as any;
      const { exp, iat, ...cleanPayload } = decodedPayload;
      const expiredToken = jwt.sign(cleanPayload, appConfig.jwt.secret, { expiresIn: '0s' });

      const requestObject = buildRequestObject(expiredToken);
      const executionContext = buildExecutionContext(null, requestObject);

      const result = await runQuery(executionContext);

      expect(result.body.singleResult.data.signOut).to.be.true;
      expect(result.body.singleResult.errors).to.be.undefined;
    });
  });

  describe('when authorization header is missing', () => {
    it('should return false', async () => {
      const executionContext = buildExecutionContext(null, {});

      const result = await runQuery(executionContext);

      expect(result.body.singleResult.data.signOut).to.be.false;
      expect(result.body.singleResult.errors).to.be.undefined;
    });
  });

  describe('when authorization header is malformed', () => {
    it('should return false for missing Bearer prefix', async () => {
      const requestObject = {
        headers: {
          authorization: validToken,
        },
      };
      const executionContext = buildExecutionContext(null, requestObject);

      const result = await runQuery(executionContext);

      expect(result.body.singleResult.data.signOut).to.be.false;
      expect(result.body.singleResult.errors).to.be.undefined;
    });

    it('should return false for invalid Bearer format', async () => {
      const requestObject = {
        headers: {
          authorization: 'Basic ' + validToken,
        },
      };
      const executionContext = buildExecutionContext(null, requestObject);

      const result = await runQuery(executionContext);

      expect(result.body.singleResult.data.signOut).to.be.false;
      expect(result.body.singleResult.errors).to.be.undefined;
    });

    it('should return false for empty authorization header', async () => {
      const requestObject = {
        headers: {
          authorization: '',
        },
      };
      const executionContext = buildExecutionContext(null, requestObject);

      const result = await runQuery(executionContext);

      expect(result.body.singleResult.data.signOut).to.be.false;
      expect(result.body.singleResult.errors).to.be.undefined;
    });
  });

  describe('when token is invalid', () => {
    it('should return false for malformed token', async () => {
      const requestObject = buildRequestObject('invalid-token');
      const executionContext = buildExecutionContext(null, requestObject);

      const result = await runQuery(executionContext);

      expect(result.body.singleResult.data.signOut).to.be.false;
      expect(result.body.singleResult.errors).to.be.undefined;
    });

    it('should return false for token with wrong secret', async () => {
      const payload = { user_data: { email: user.email } };
      const wrongSecretToken = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });

      const requestObject = buildRequestObject(wrongSecretToken);
      const executionContext = buildExecutionContext(null, requestObject);

      const result = await runQuery(executionContext);

      expect(result.body.singleResult.data.signOut).to.be.false;
      expect(result.body.singleResult.errors).to.be.undefined;
    });

    it('should return false for token with non-existent user', async () => {
      const payload = { user_data: { email: faker.internet.email() } };
      const nonExistentUserToken = jwt.sign(payload, appConfig.jwt.secret, { expiresIn: '1h' });

      const requestObject = buildRequestObject(nonExistentUserToken);
      const executionContext = buildExecutionContext(null, requestObject);

      const result = await runQuery(executionContext);

      expect(result.body.singleResult.data.signOut).to.be.false;
      expect(result.body.singleResult.errors).to.be.undefined;
    });
  });

  describe('when token is already signed out', () => {
    it('should return false for already signed out token', async () => {
      const requestObject = buildRequestObject(validToken);
      const executionContext = buildExecutionContext(null, requestObject);

      const firstResult = await runQuery(executionContext);
      expect(firstResult.body.singleResult.data.signOut).to.be.true;

      const secondResult = await runQuery(executionContext);
      expect(secondResult.body.singleResult.data.signOut).to.be.false;
      expect(secondResult.body.singleResult.errors).to.be.undefined;
    });
  });
});
