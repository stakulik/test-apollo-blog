import jwt, { type JwtPayload } from 'jsonwebtoken';

class JWT {
  static generate(
    payload: JwtPayload,
    secret: jwt.Secret,
    options?: jwt.SignOptions,
  ): string {
    return jwt.sign(payload, secret, options);
  }

  static parse(
    token: string,
    secret: jwt.Secret,
  ): string | JwtPayload | null {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return null;
    }
  }

  static parseIgnoreExpiration(
    token: string,
    secret: jwt.Secret,
  ): string | JwtPayload | null {
    try {
      return jwt.verify(token, secret, { ignoreExpiration: true });
    } catch (err) {
      return null;
    }
  }
}

export default JWT;
