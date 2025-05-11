import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

import { UserRepository, filterQueryOptions } from '../repositories';

import { CrudService } from './crud.service';

const saltLength = 10;

export class UserService extends CrudService {
  constructor() {
    super(new UserRepository());
  }

  async create(data, options = {}) {
    const encodedPassword = await bcrypt.hash(data.password, saltLength);

    return this.repository.create({ ...data, password: encodedPassword }, options);
  }

  async credentialsTaken(data, options = {}) {
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
