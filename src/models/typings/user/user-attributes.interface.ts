import { DefaultAttributes } from '../default';

export interface UserAttributes extends DefaultAttributes {
  email: string;
  nickname: string;
  password: string;
}
