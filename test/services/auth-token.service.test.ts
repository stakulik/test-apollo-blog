import { expect } from 'chai';
import { factory } from 'factory-girl';

import { User } from '../../src/models';
import { sequelize } from '../../src/db';
import { AuthTokenService, generateJWT } from '../../src/services';
import { getClockTimestamp } from '../utils/datetime';

describe(__filename, () => {
  let authTokenService;
  let user;

  beforeEach(async () => {
    authTokenService = new AuthTokenService();
    user = await factory.create<User>('User');
  });

  describe('#create', () => {
    const runTest = async (data) => authTokenService.create(data);

    const getToken = async (user) => generateJWT({ user_data: { email: user.email } });

    it('should create instance', async () => {
      const startTime = await getClockTimestamp(sequelize);
      const result = await runTest({ user });
      const finishTime = await getClockTimestamp(sequelize);

      const token = await getToken(user);
      expect(result.token).to.eql(token);
      expect(result.user_id).to.eql(user.id);
      expect(result.created_at).to.be.within(startTime, finishTime);
    });
  });
});
