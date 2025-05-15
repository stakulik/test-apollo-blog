import { User } from '../../models';
import { CreationAttributes } from '../../repositories';

export interface CreateAuthTokenParams extends CreationAttributes {
  user: User;
}
