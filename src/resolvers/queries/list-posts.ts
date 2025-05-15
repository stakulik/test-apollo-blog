/* eslint-disable arrow-body-style */
import { throwUserInputError } from '../../lib/gql';
import { PostService } from '../../services';
import { authRequest } from '../shared';
import { ListPosts, PostsConnection } from '../typings';

const postService = new PostService();

const listPostsQuery = async (
  _parent,
  params: ListPosts,
): Promise<PostsConnection> => {
  let result: PostsConnection | undefined;

  try {
    result = await postService.list(params);
  } catch (error) {
    throwUserInputError(error.message);
  }

  return result;
};

export const listPosts = authRequest(listPostsQuery);
