import { JWT, JWTExpiration } from '../../../lib/jwt';
import { appConfig } from '../../../config';

export const generateJWT = (payload) => JWT.generate(payload, appConfig.jwt.secret, { expiresIn: JWTExpiration });
