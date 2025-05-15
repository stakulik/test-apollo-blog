import { ResolverParams } from './resolver-params.interface';

export interface SignUp extends ResolverParams {
  email: string;
  nickname: string;
  password: string;
}
