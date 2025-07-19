import { expect } from 'chai';
import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

import { User } from '../../src/models';
import { AuthService, generateJWT, getHash } from '../../src/services';

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
});
