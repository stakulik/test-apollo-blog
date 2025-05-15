import type { JwtPayload } from 'jsonwebtoken';

import { JWT, JWTExpiration } from '../../../lib/jwt';
import { appConfig } from '../../../config';

export const generateJWT = (
  payload: JwtPayload,
): string => JWT.generate(payload, appConfig.jwt.secret, { expiresIn: JWTExpiration });
