import { Post } from '../../models';

export interface PostListItem extends Post {
  epoch_time: string;
}
