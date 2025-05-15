import { JWT } from '../../../lib/jwt';
import { appConfig } from '../../../config';
import { JWTAuthPayload } from '../../typings';

export const parseJWT = (
  token: string,
): JWTAuthPayload => JWT.parse(token, appConfig.jwt.secret) as JWTAuthPayload;
