import { faker } from '@faker-js/faker';

import { AuthToken } from '../../src/models';

export const defineAuthTokenFactory = (factory) => {
  factory.define('AuthToken', AuthToken, {
    token: () => faker.internet.jwt(),
    user_id: () => faker.string.uuid(),
  });
};
