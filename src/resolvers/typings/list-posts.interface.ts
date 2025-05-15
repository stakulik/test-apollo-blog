import { ResolverParams } from './resolver-params.interface';

export interface ListPosts extends ResolverParams {
  after?: string;
  pageSize?: number;
}
