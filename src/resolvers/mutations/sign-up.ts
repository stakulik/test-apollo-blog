import { throwUserInputError } from '../../lib/gql';
import { UserService } from '../../services';
import { isEmail } from '../helpers';

const userService = new UserService();

const validate = async (params) => {
  const { email, nickname } = params;

  if (!isEmail(email)) {
    throwUserInputError('Email has wrong value', 'email');
  }

  const isCredentialsTaken = await userService.isCredentialsTaken({ email, nickname });

  if (isCredentialsTaken) {
    throwUserInputError('Email or nickname has already been taken');
  }
};

const signUpMutation = async (
  _parent,
  params,
) => {
  await validate(params);

  const result = await userService.create(params);

  return !!result;
};

export { signUpMutation as signUp };
