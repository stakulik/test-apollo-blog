import { DefaultAttributes } from '../default';

export interface CommentAttributes extends DefaultAttributes {
  body: string;
  published_at: Date;
  user_id: string;
}
