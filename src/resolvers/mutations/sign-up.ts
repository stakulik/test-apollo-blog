import { throwUserInputError } from '../../lib/gql';
import { UserService } from '../../services';
import { isEmail, sanitizeEmail } from '../shared';
import { SignUp } from '../typings';

const userService = new UserService();

const validate = async (params: SignUp): Promise<void> => {
  const { email, nickname } = params;

  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedNickname = nickname.trim();

  if (!isEmail(sanitizedEmail)) {
    throwUserInputError('Email has wrong value', 'email');
  }

  if (!nickname || typeof nickname !== 'string' || sanitizedNickname.length === 0) {
    throwUserInputError('Nickname is required', 'nickname');
  }

  const isCredentialsTaken = await userService.isCredentialsTaken({
    email: sanitizedEmail,
    nickname: sanitizedNickname,
  });

  if (isCredentialsTaken) {
    throwUserInputError('Email or nickname has already been taken');
  }
};

const signUpMutation = async (
  _parent,
  params: SignUp,
): Promise<boolean> => {
  await validate(params);

  const sanitizedParams = {
    ...params,
    email: sanitizeEmail(params.email),
    nickname: params.nickname.trim(),
  };

  const result = await userService.create(sanitizedParams);

  return !!result;
};

export { signUpMutation as signUp };
