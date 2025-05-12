import { throwUserInputError } from '../../lib/gql';
import { PostService } from '../../services';
import { authRequest, getUserFromContext } from '../helpers';

const postService = new PostService();

const validate = (params) => {
  const { title, body } = params;

  if (!title.length || !body.length) {
    throwUserInputError("Title and body can't be empty");
  }
};

const createPostMutation = async (
  _parent,
  params,
  context,
) => {
  validate(params);

  const user = getUserFromContext(context);

  return postService.create({ ...params, user_id: user.id });
};

export const createPost = authRequest(createPostMutation);
