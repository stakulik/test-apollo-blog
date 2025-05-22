import { faker } from '@faker-js/faker';

import { Post } from '../../src/models';

export const definePostFactory = (factory) => {
  factory.define('Post', Post, {
    body: () => faker.lorem.sentence(),
    title: () => faker.lorem.sentence(),
    user_id: () => faker.string.uuid(),
  });
};
