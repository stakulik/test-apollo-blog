import { throwUserInputError } from '../../lib/gql';
import { User } from '../../models';
import { AuthTokenService, UserService } from '../../services';
import { isEmail, isValidForPassword } from '../shared';
import { SignIn } from '../typings';

const authTokenService = new AuthTokenService();
const userService = new UserService();

const validate = async (params: SignIn): Promise<void> => {
  const { email, password } = params;

  if (!isEmail(email)) {
    throwUserInputError('Email has wrong value', 'email');
  }

  if (!isValidForPassword(password)) {
    throwUserInputError('Password has wrong value', 'password');
  }
};

const signInMutation = async (
  _parent,
  params: SignIn,
): Promise<string | null> => {
  await validate(params);

  const { email } = params;

  const user = await userService.getByCriteria<User>({ email });

  if (!user) {
    return null;
  }

  const isCredentialsCorrect = await userService.isCredentialsCorrect(user, params);

  if (!isCredentialsCorrect) {
    return null;
  }

  const authToken = await authTokenService.create({ user });

  if (authToken) {
    return authToken.token;
  }

  return null;
};

export { signInMutation as signIn };
