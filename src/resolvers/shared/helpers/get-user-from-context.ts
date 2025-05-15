import { AuthedResolverContext } from '../../typings';
import { User } from '../../../models';

export const getUserFromContext = (context: AuthedResolverContext): User => context.userData.user;
