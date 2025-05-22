import { factory } from 'factory-girl';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { sequelize } from '../src/db';

import { defineFactories } from './factories';

chai.use(chaiAsPromised);

defineFactories(factory);

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await factory.cleanUp();
});
