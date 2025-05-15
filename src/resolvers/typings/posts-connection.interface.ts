import { PostListItem } from '../../services';

export interface PostsConnection {
  edges: PostListItem[];
  cursor: string;
  lastPage: boolean;
}
