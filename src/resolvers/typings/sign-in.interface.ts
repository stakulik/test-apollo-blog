import { ResolverParams } from './resolver-params.interface';

export interface SignIn extends ResolverParams {
  email: string;
  password: string;
}
