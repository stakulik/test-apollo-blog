import { CrudRepository } from './crud.repository';

import { Post } from '../models';

export class PostRepository extends CrudRepository {
  constructor() {
    super(Post);
  }
}
