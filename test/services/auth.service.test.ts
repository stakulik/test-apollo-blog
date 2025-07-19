import { expect } from 'chai';
import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';

import { User } from '../../src/models';
import { AuthService, generateJWT, getHash } from '../../src/services';
import { appConfig } from '../../src/config';

describe(__filename, () => {
  let authService: AuthService;
  let user: User;
  let password: string;

  beforeEach(async () => {
    authService = new AuthService();
    password = faker.lorem.word();
    const hashedPassword = await getHash(password);
    user = await factory.create<User>('User', {
      password: hashedPassword,
    });
  });

  describe('#signIn', () => {
    const runTest = async (params) => authService.signIn(params);

    describe('when credentials are valid', () => {
      it('should return token and user', async () => {
        const result = await runTest({
          email: user.email,
          password,
        });

        expect(result).to.not.be.null;
        expect(result?.token).to.be.a('string');
        expect(result?.user.id).to.eql(user.id);
        expect(result?.user.email).to.eql(user.email);
      });

      it('should return valid JWT token', async () => {
        const result = await runTest({
          email: user.email,
          password,
        });

        const expectedToken = generateJWT({ user_data: { email: user.email } });
        expect(result?.token).to.eql(expectedToken);
      });
    });

    describe('when user does not exist', () => {
      it('should return null', async () => {
        const result = await runTest({
          email: faker.internet.email(),
          password: faker.lorem.word(),
        });

        expect(result).to.be.null;
      });
    });

    describe('when password is incorrect', () => {
      it('should return null', async () => {
        const result = await runTest({
          email: user.email,
          password: faker.lorem.word(),
        });

        expect(result).to.be.null;
      });
    });
  });

  describe('#validateToken', () => {
    let validToken: string;

    beforeEach(async () => {
      const signInResult = await authService.signIn({
        email: user.email,
        password,
      });

      validToken = signInResult?.token!;
    });

    const runTest = async (token) => authService.validateToken(token);

    describe('when token is valid', () => {
      it('should return user', async () => {
        const result = await runTest(validToken);

        expect(result).to.not.be.null;
        expect(result?.id).to.eql(user.id);
        expect(result?.email).to.eql(user.email);
      });
    });

    describe('when token is null or empty', () => {
      it('should return null for null token', async () => {
        const result = await runTest(null);

        expect(result).to.be.null;
      });

      it('should return null for empty string', async () => {
        const result = await runTest('');

        expect(result).to.be.null;
      });
    });

    describe('when token is invalid', () => {
      it('should return null for malformed token', async () => {
        const result = await runTest('invalid-token');

        expect(result).to.be.null;
      });
    });

    describe('when token is valid but user does not exist', () => {
      it('should return null', async () => {
        const tokenForNonexistentUser = generateJWT({
          user_data: {
            email: faker.internet.email(),
          },
        });

        const result = await runTest(tokenForNonexistentUser);

        expect(result).to.be.null;
      });
    });
  });

  describe('#signOut', () => {
    let validToken: string;

    beforeEach(async () => {
      const signInResult = await authService.signIn({
        email: user.email,
        password,
      });

      validToken = signInResult?.token!;
    });

    const runTest = async (token) => authService.signOut(token);

    describe('when token is valid', () => {
      it('should return true and invalidate token', async () => {
        const result = await runTest(validToken);

        expect(result).to.be.true;

        const validateResult = await authService.validateToken(validToken);
        expect(validateResult).to.be.null;
      });

      it('should return true and remove token from database', async () => {
        const validateBefore = await authService.validateToken(validToken);
        expect(validateBefore).to.not.be.null;

        const result = await runTest(validToken);
        expect(result).to.be.true;

        const validateAfter = await authService.validateToken(validToken);
        expect(validateAfter).to.be.null;
      });
    });

    describe('when token is expired', () => {
      let expiredToken: string;

      beforeEach(() => {
        const payload = { user_data: { email: user.email } };
        expiredToken = jwt.sign(payload, appConfig.jwt.secret, { expiresIn: '0s' });
      });

      it('should return true for expired token', async () => {
        const result = await runTest(expiredToken);

        expect(result).to.be.true;
      });
    });

    describe('when token is invalid', () => {
      it('should return false for null token', async () => {
        const result = await runTest(null);

        expect(result).to.be.false;
      });

      it('should return false for empty token', async () => {
        const result = await runTest('');

        expect(result).to.be.false;
      });

      it('should return false for malformed token', async () => {
        const result = await runTest('invalid-token');

        expect(result).to.be.false;
      });

      it('should return false for token with wrong secret', async () => {
        const payload = { user_data: { email: user.email } };
        const wrongSecretToken = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });

        const result = await runTest(wrongSecretToken);

        expect(result).to.be.false;
      });

      it('should return false for token with non-existent user', async () => {
        const payload = { user_data: { email: faker.internet.email() } };
        const nonExistentUserToken = jwt.sign(payload, appConfig.jwt.secret, { expiresIn: '1h' });

        const result = await runTest(nonExistentUserToken);

        expect(result).to.be.false;
      });
    });

    describe('when token is already signed out', () => {
      it('should return false for already signed out token', async () => {
        await runTest(validToken);

        const result = await runTest(validToken);

        expect(result).to.be.false;
      });
    });
  });
});
