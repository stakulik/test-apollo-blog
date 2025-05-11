import { DefaultAttributes } from '../default';

export interface AuthTokenAttributes extends DefaultAttributes {
  token: string;
  user_id: string;
}
