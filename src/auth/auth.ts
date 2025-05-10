import * as authentication from 'auth-header';
import type { Request } from 'express';

import JWT from './jwt';

import { appConfig } from '../config';

export class Auth {
  request: Request;

  constructor(req: Request) {
    this.request = req;
  }

  private async getUserDataFromToken(
    token: string | null,
  ) {
    if (typeof token !== 'string') {
      return null;
    }

    const payload = JWT.parse(token, appConfig.jwt.secret);

    if (!payload) {
      return null;
    }

    const { email } = payload.user_data;

    const user: User = await User.findOne({
      where: { email },
    });

    if (user) {
      return { user };
    }

    return null;
  }

  private getTokenFromHeader(
    headerValue: string | undefined,
  ): string | null {
    if (!headerValue) {
      return null;
    }

    const auth = authentication.parse(headerValue);

    if (!auth || !['Bearer'].includes(auth.scheme)) {
      return null;
    }

    return auth.token;
  }

  async getUserData() {
    try {
      const headerValue = this.request.headers.authorization;

      const authToken = this.getTokenFromHeader(headerValue);

      if (!authToken) {
        return null;
      }

      const userData = await this.getUserDataFromToken(authToken);

      if (!userData) {
        return null;
      }

      const { user } = userData;

      return { user };
    } catch (e: unknown) {
      return null;
    }
  }
}
