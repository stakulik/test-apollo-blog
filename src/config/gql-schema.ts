export const GQLSchema = `
  "Implementing UUID field type for ids"
  scalar UUID
  "Implementing DateTime field type to show date fields"
  scalar DateTime

  type Post {
    id: UUID!
    title: String!
    body: String!
    published_at: DateTime!
  }

  type Query {
    getPost: Post
    listPosts: [Post]
  }

  type Mutation {
    createPost(
      title: String!
      body: String!
      published_at: DateTime
    ): Post!

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
