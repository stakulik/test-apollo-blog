import { Post } from '../models';

import { CrudRepository } from './crud.repository';

export class PostRepository extends CrudRepository {
  constructor() {
    super(Post);
  }
}
