import type { GraphQLResolveInfo } from 'graphql';

import { throwAuthenticationError } from '../../../lib/gql';
import { AsyncResolver, AuthedResolverContext } from '../../typings';

export function authRequest(asyncResolver: AsyncResolver): AsyncResolver {
  return (parent: unknown, params: any, context: any, info: GraphQLResolveInfo) => {
    const user = (context as AuthedResolverContext).userData?.user;

    if (!user) {
      throwAuthenticationError();
    }

    return asyncResolver(parent, params, context as AuthedResolverContext, info);
  };
}
