import { AuthToken } from '../models';

import { CrudRepository } from './crud.repository';

export class AuthTokenRepository extends CrudRepository {
  constructor() {
    super(AuthToken);
  }
}
