/* eslint-disable arrow-body-style */
import { PostService } from '../../services';
import { Post } from '../../models';
import { authRequest } from '../shared';
import { GetPost } from '../typings';

const postService = new PostService();

const getPostQuery = async (
  _parent,
  params: GetPost,
): Promise<Post | null> => {
  return postService.getById(params.id);
};

export const getPost = authRequest(getPostQuery);
