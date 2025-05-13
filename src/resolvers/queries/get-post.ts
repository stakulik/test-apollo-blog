/* eslint-disable arrow-body-style */
import { PostService } from '../../services';
import { authRequest } from '../shared';

const postService = new PostService();

const getPostQuery = async (
  _parent,
  params,
) => {
  return postService.getById(params.id);
};

export const getPost = authRequest(getPostQuery);
