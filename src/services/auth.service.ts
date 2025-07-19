import { User } from '../models';
import { parseJWT } from '../auth/shared';

import { SignInParams, SignInResult } from './typings';
import { AuthTokenService } from './auth-token.service';
import { UserService } from './user.service';

const authTokenService = new AuthTokenService();
const userService = new UserService();

export class AuthService {
  async signIn(params: SignInParams): Promise<SignInResult | null> {
    const { email, password } = params;

    const user = await userService.getByCriteria<User>({ email });

    if (!user) {
      return null;
    }

    const isCredentialsCorrect = await userService.isCredentialsCorrect(user, { password });

    if (!isCredentialsCorrect) {
      return null;
    }

    const authToken = await authTokenService.create({ user });

    if (!authToken) {
      return null;
    }

    return {
      token: authToken.token,
      user,
    };
  }

  async validateToken(token: string): Promise<User | null> {
    if (!token) {
      return null;
    }

    const payload = parseJWT(token);

    if (!payload) {
      return null;
    }

    const email = payload?.user_data?.email;

    const user = await userService.getByCriteria<User>({ email });

    if (!user) {
      return null;
    }

    const isTokenValid = await authTokenService.validateToken(token, user.id);

    if (!isTokenValid) {
      return null;
    }

    return user;
  }
}
