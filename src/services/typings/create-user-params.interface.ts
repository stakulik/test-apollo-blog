import { CreationAttributes } from '../../repositories';

export interface CreateUserParams extends CreationAttributes {
  email: string;
  nickname: string;
  password: string;
}
