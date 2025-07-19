import { IncomingRequestContext } from '../../lib/shared';
import { AuthService } from '../../services';
import { getTokenFromHeader } from '../shared';

const authService = new AuthService();

const signOutMutation = async (
  _parent,
  _args,
  context: IncomingRequestContext,
): Promise<boolean> => {
  try {
    const { req } = context;
    const headerValue = req.headers.authorization;
    const token = getTokenFromHeader(headerValue);

    if (!token) {
      return false;
    }

    return await authService.signOut(token);
  } catch {
    return false;
  }
};

export { signOutMutation as signOut };
