import { JWT } from '../../../lib/jwt';
import { appConfig } from '../../../config';

export const parseJWT = (token) => JWT.parse(token, appConfig.jwt.secret);
