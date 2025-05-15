import { PostListItem } from './post-list-item.interface';

export interface ListPostsResult {
  edges: PostListItem[];
  cursor: string;
  lastPage: boolean;
}
