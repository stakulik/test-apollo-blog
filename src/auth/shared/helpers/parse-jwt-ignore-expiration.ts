import { JWT } from '../../../lib/jwt';
import { appConfig } from '../../../config';
import { JWTAuthPayload } from '../../typings';

export const parseJWTIgnoreExpiration = (
  token: string,
): JWTAuthPayload | null => {
  const result = JWT.parseIgnoreExpiration(token, appConfig.jwt.secret);

  return result as JWTAuthPayload;
};
