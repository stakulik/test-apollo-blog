import { UserRepository } from '../repositories';

import { CrudService } from './crud.service';

export class UserService extends CrudService {
  constructor() {
    super(new UserRepository());
  }
}
