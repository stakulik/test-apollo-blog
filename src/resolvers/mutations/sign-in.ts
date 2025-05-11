import { throwUserInputError } from '../../lib/gql';
import { AuthTokenService, UserService } from '../../services';
import { isEmail, isValidForPassword } from '../helpers';

const authTokenService = new AuthTokenService();
const userService = new UserService();

const validate = async (params) => {
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
  params,
) => {
  await validate(params);

  const { email } = params;

  const user = await userService.getByCriteria({ email });

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
