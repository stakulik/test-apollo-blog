import { throwUserInputError } from '../../lib/gql';
import { Post } from '../../models';
import { PostService } from '../../services';
import { addModerationJob } from '../../queues';
import { authRequest, getUserFromContext } from '../shared';
import { AuthedResolverContext, CreatePost } from '../typings';

const postService = new PostService();

const validate = (params: CreatePost): void => {
  const { title, body } = params;

  if (!title.length || !body.length) {
    throwUserInputError("Title and body can't be empty");
  }
};

const createPostMutation = async (
  _parent,
  params: CreatePost,
  context: AuthedResolverContext,
): Promise<Post | null> => {
  validate(params);

  const user = getUserFromContext(context);

  const post = await postService.create<Post>({ ...params, user_id: user.id });

  if (post) {
    await addModerationJob(post.id);
  }

  return post;
};

export const createPost = authRequest(createPostMutation);
