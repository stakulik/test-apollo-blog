import { User } from '../models';

import { CrudRepository } from './crud.repository';

export class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }
}
