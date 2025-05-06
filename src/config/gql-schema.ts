export const GQLSchema = `
  type Post {
    title: String
  }

  type Query {
    getPost: Post
    listPosts: [Post]
  }
`;
