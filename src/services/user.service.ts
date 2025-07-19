import { Op } from 'sequelize';

import { User } from '../models';
import {
  filterQueryOptions,
  QueryOptions,
  UserRepository,
} from '../repositories';

import { CreateUserParams } from './typings';
import { CrudService } from './crud.service';
import { compareHashes, getHash } from './shared';

export class UserService extends CrudService {
  constructor() {
    super(new UserRepository());
  }

  async create<M = User | null>(data: CreateUserParams, options: QueryOptions = {}): Promise<M | null> {
    const hashedPassword = await getHash(data.password);

    return this.repository.create({ ...data, password: hashedPassword }, options);
  }

  async isCredentialsCorrect(user: User, data: Pick<CreateUserParams, 'password'>): Promise<boolean> {
    const { password } = data;

    return compareHashes(password, user.password);
  }

  async isCredentialsTaken(
    data: Pick<CreateUserParams, 'email' | 'nickname'>,
    options: QueryOptions = {},
  ): Promise<boolean> {
    const queryOptions = filterQueryOptions(options);

    const result = await this.modelName.findOne({
      where: {
        [Op.or]: data,
      },
      ...queryOptions,
    });

    return !!result;
  }
}
