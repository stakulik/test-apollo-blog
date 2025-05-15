import { IncomingRequestContext, UserData } from '../../lib/shared';

export interface AuthedResolverContext extends IncomingRequestContext {
  userData: UserData;
}
