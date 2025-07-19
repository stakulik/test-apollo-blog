import * as authentication from 'auth-header';
import type { IncomingMessage } from 'http';

import { AuthService } from '../services';
import { UserData } from '../lib/shared';

const authService = new AuthService();

export class Auth {
  request: IncomingMessage;

  constructor(request: IncomingMessage) {
    this.request = request;
  }

  private async getAuthDataFromToken(
    token: string | null,
  ): Promise<UserData | null> {
    if (!token) {
      return null;
    }

    const user = await authService.validateToken(token);

    if (!user) {
      return null;
    }

    return { user };
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
