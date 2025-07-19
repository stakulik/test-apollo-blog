import * as authentication from 'auth-header';

export const getTokenFromHeader = (headerValue: string | undefined): string | null => {
  if (!headerValue) {
    return null;
  }

  const auth = authentication.parse(headerValue);

  if (!auth || !['Bearer'].includes(auth.scheme)) {
    return null;
  }

  return auth.token;
};
