import { throwUserInputError } from '../../lib/gql';
import { AuthService } from '../../services';
import { isEmail, isValidForPassword } from '../shared';
import { SignIn } from '../typings';

const authService = new AuthService();

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

  const result = await authService.signIn(params);

  return result?.token || null;
};

export { signInMutation as signIn };
