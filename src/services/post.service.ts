import { PostRepository } from '../repositories';

import { CrudService } from './crud.service';

export class PostService extends CrudService {
  constructor() {
    super(new PostRepository());
  }
}
