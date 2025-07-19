import { AuthToken } from '../models';
import {
  AuthTokenRepository,
  QueryOptions,
} from '../repositories';

import { compareHashes, generateJWT, getHash } from './shared';
import { CrudService } from './crud.service';
import { CreateAuthTokenParams } from './typings';

export class AuthTokenService extends CrudService {
  constructor() {
    super(new AuthTokenRepository());
  }

  async create<M = AuthToken | null>(data: CreateAuthTokenParams, options: QueryOptions = {}): Promise<M | null> {
    const { user } = data;

    const payload = { user_data: { email: user.email } };

    const token = generateJWT(payload);

    const hashedToken = await getHash(token);

    await this.repository.create<AuthToken>({ user_id: user.id, token: hashedToken }, options);

    return { token } as unknown as M;
  }

  async validateToken(token: string, userId: string): Promise<boolean> {
    const authTokens = await this.find<AuthToken>({ user_id: userId });

    for (const authToken of authTokens) {
      const isValid = await compareHashes(token, authToken.token);

      if (isValid) {
        return true;
      }
    }

    return false;
  }

  async findCurrentTokenId(token: string, userId: string): Promise<string | null> {
    const authTokens = await this.find<AuthToken>({ user_id: userId });

    for (const authToken of authTokens) {
      const isCurrent = await compareHashes(token, authToken.token);

      if (isCurrent) {
        return authToken.id;
      }
    }

    return null;
  }
}
