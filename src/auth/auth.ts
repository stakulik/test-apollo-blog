import * as authentication from 'auth-header';
import type { IncomingMessage } from 'http';

import { User } from '../models';
import { UserService } from '../services';
import { UserData } from '../lib/shared';

import { parseJWT } from './shared';

const userService = new UserService();

export class Auth {
  request: IncomingMessage;

  constructor(request: IncomingMessage) {
    this.request = request;
  }

  private async getAuthDataFromToken(
    token: string | null,
  ): Promise<UserData | null> {
    if (typeof token !== 'string') {
      return null;
    }

    const payload = parseJWT(token);

    if (!payload) {
      return null;
    }

    const email = payload?.user_data?.email;

    const user = await userService.getByCriteria<User>({ email });

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

  async getAuthData(): Promise<UserData | null> {
    try {
      const headerValue = this.request.headers.authorization;

      const authToken = this.getTokenFromHeader(headerValue);

      if (!authToken) {
        return null;
      }

      const userData = await this.getAuthDataFromToken(authToken);

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
