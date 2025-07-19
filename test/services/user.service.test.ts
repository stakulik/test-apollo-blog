import bcrypt from 'bcryptjs';
import { expect } from 'chai';
import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

import { User } from '../../src/models';
import { sequelize } from '../../src/db';
import { UserService,  } from '../../src/services';
import { omitCommonAttributes } from '../utils/common';
import { getClockTimestamp } from '../utils/datetime';

describe(__filename, () => {
  let userService;

  beforeEach(async () => {
    userService = new UserService();
  });

  describe('#create', () => {
    const runTest = async (data) => userService.create(data);

    it('should create instance', async () => {
      const password = faker.lorem.word();
      const creationAttributes = await factory.attrs('User', {
        password,
      });

      const startTime = await getClockTimestamp(sequelize);
      const result = await runTest(creationAttributes);
      const finishTime = await getClockTimestamp(sequelize);

      expect(
        omitCommonAttributes(result.toJSON(), ['password'])).to.eql({
          ...omitCommonAttributes(creationAttributes, ['password']),
        });
      await expect(bcrypt.compare(password, result.password)).to.eventually.be.true;
      expect(result.created_at).to.be.within(startTime, finishTime);
    });
  });

  describe('#isCredentialsTaken', () => {
    let creationAttributes;

    const runTest = async (data) => userService.isCredentialsTaken(data);

    it('should return false', async () => {
      creationAttributes = await factory.attrs('User');

      const result = await runTest(creationAttributes);

      expect(result).to.be.false;
    });

    context('when email already taken', () => {
      it('should return true', async () => {
        const anotherUser = await factory.create<User>('User');

        creationAttributes = await factory.attrs('User', {
          nickname: anotherUser.nickname,
        });

        const result = await runTest(creationAttributes);

        expect(result).to.be.true;
      });
    });
  });
});
