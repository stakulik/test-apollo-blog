export const GQLSchema = `
  "Implementing UUID field type for ids"
  scalar UUID
  "Implementing DateTime field type to show date fields"
  scalar DateTime

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
