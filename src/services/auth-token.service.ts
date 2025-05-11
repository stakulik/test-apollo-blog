import { AuthTokenRepository } from '../repositories';

import { generateJWT } from './shared';
import { CrudService } from './crud.service';

export class AuthTokenService extends CrudService {
  constructor() {
    super(new AuthTokenRepository());
  }

  async create(data, options = {}) {
    const { user } = data;

    const payload = { user: { email: user.email } };

    const token = generateJWT(payload);

    return this.repository.create({ user_id: user.id, token }, options);
  }
}
