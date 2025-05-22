import { faker } from '@faker-js/faker';

import { User } from '../../src/models';

export const defineUserFactory = (factory) => {
  factory.define('User', User, {
    email: () => faker.internet.email(),
    nickname: () => faker.internet.displayName(),
    password: () => faker.string.hexadecimal({ length: 10 }),
  });
};
