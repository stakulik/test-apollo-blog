/* eslint-disable arrow-body-style */
import { throwUserInputError } from '../../lib/gql';
import { PostService } from '../../services';
import { authRequest } from '../shared';

const postService = new PostService();

const listPostsQuery = async (
  _parent,
  params,
) => {
  let result;

  try {
    result = await postService.list(params);
  } catch (error) {
    throwUserInputError(error.message);
  }

  return result;
};

export const listPosts = authRequest(listPostsQuery);
