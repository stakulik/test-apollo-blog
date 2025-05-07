import jwt from 'jsonwebtoken';

class JWT {
  static generate(
    payload: string | Record<string, unknown>,
    secret: jwt.Secret,
    options?: jwt.SignOptions,
  ) {
    return jwt.sign(payload, secret, options);
  }

  static parse(
    token: string,
    secret: jwt.Secret,
  ) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return null;
    }
  }
}

export default JWT;
