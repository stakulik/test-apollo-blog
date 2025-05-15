import {
  AuthToken,
  Comment,
  Post,
  User,
} from '../../models';

export type DataModel = typeof AuthToken
| typeof Comment
| typeof Post
| typeof User;
