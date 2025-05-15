import type { GraphQLResolveInfo } from 'graphql';

import { IncomingRequestContext } from '../../lib/shared';

import { ResolverParams } from './resolver-params.interface';

export type AsyncResolver = (
  parent: unknown,
  params: ResolverParams,
  context: IncomingRequestContext,
  info: GraphQLResolveInfo
) => Promise<unknown>;
