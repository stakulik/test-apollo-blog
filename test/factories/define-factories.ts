import { defineAuthTokenFactory } from './auth-token.factory';
import { definePostFactory } from './post.factory';
import { defineUserFactory } from './user.factory';

export const defineFactories = (factory) => {
  defineAuthTokenFactory(factory);
  definePostFactory(factory);
  defineUserFactory(factory);
};
