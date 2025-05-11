export const GQLSchema = `
  type Post {
    title: String
  }

  type Query {
    getPost: Post
    listPosts: [Post]
  }

  type Mutation {
    signIn(
      email: String!
      password: String!
    ): String

    signUp(
      email: String!
      nickname: String!
      password: String!
    ): Boolean!
  }
`;
