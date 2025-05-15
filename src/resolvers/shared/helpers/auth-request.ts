import type { GraphQLResolveInfo } from 'graphql';

import { IncomingRequestContext } from '../../../lib/shared';
import { throwAuthenticationError } from '../../../lib/gql';
import { AsyncResolver, ResolverParams } from '../../typings';

export function authRequest(asyncResolver: AsyncResolver): AsyncResolver {
  return (parent: unknown, params: ResolverParams, context: IncomingRequestContext, info: GraphQLResolveInfo) => {
    const user = context.userData?.user;

    if (!user) {
      throwAuthenticationError();
    }

    return asyncResolver(parent, params, context, info);
  };
}
