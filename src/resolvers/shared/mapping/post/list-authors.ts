import { Post, User } from '../../../../models';
import { UserService } from '../../../../services';

const userService = new UserService();

export const listAuthors = async (
  posts: Post[],
): Promise<User[]> => {
  const userIds = posts.map((post) => post.user_id);

  const users = await userService.find<User>({ id: userIds });

  const usersMap = new Map();
  users.forEach((user) => usersMap.set(user.id, user));

  return posts.map((post) => usersMap.get(post.user_id));
};
