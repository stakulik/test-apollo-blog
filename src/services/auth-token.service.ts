import { AuthToken } from '../models';
import {
  AuthTokenRepository,
  QueryOptions,
} from '../repositories';

import { generateJWT } from './shared';
import { CrudService } from './crud.service';
import { CreateAuthTokenParams } from './typings';

export class AuthTokenService extends CrudService {
  constructor() {
    super(new AuthTokenRepository());
  }

  async create<M = AuthToken>(data: CreateAuthTokenParams, options: QueryOptions = {}): Promise<M> {
    const { user } = data;

    const payload = { user_data: { email: user.email } };

    const token = generateJWT(payload);

    return this.repository.create({ user_id: user.id, token }, options);
  }
}
