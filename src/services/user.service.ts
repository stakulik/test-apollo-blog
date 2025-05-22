import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

import { User } from '../models';
import {
  filterQueryOptions,
  QueryOptions,
  UserRepository,
} from '../repositories';

import { CreateUserParams } from './typings';
import { CrudService } from './crud.service';
import { saltLength } from './shared';

export class UserService extends CrudService {
  constructor() {
    super(new UserRepository());
  }

  async create<M = User | null>(data: CreateUserParams, options: QueryOptions = {}): Promise<M | null> {
    const encodedPassword = await bcrypt.hash(data.password, saltLength);

    return this.repository.create({ ...data, password: encodedPassword }, options);
  }

  async isCredentialsCorrect(user: User, data: Pick<CreateUserParams, 'password'>): Promise<boolean> {
    const { password } = data;

    return bcrypt.compare(password, user.password);
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
