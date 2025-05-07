import { PostService } from '../../services';

import { authRequest } from '../helpers';

const postService = new PostService();

const getPostQuery = async (
  _parent,
  params,
  context,
) => {
  return postService.getById({
    id: 1,
  });
};

export const getPost = authRequest(getPostQuery);
