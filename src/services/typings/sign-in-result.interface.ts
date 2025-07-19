import { User } from '../../models';

export interface SignInResult {
  token: string;
  user: User;
}
