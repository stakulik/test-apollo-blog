import { DefaultAttributes } from '../default';

export interface PostAttributes extends DefaultAttributes {
  body: string;
  published_at: Date;
  title: string;
  user_id: string;
  moderated_at: Date;
}
