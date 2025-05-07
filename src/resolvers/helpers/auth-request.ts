import { throwAuthenticationError } from '../../lib/gql';

export function authRequest(
  asyncResolver,
) {
  return (parent, params, context, info) => {
    const user = context.userData?.user;

    if (!user) {
      throwAuthenticationError();
    }

    return asyncResolver(parent, params, context, info);
  };
}
