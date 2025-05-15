import { ResolverParams } from './resolver-params.interface';

export interface CreatePost extends ResolverParams {
  title: string;
  body: string;
  published_at?: Date;
}
