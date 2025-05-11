import { AuthTokenRepository } from '../repositories';

import { CrudService } from './crud.service';

export class AuthTokenService extends CrudService {
  constructor() {
    super(new AuthTokenRepository());
  }
}
