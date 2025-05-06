import { PostService } from '../../services';

const postService = new PostService();

const getPostQuery = async () => {
  return postService.getById({
    id: 1,
  });
};

export const getPost = getPostQuery;
