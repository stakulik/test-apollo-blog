export const GQLSchema = `
  "Implementing UUID field type for ids"
  scalar UUID
  "Implementing DateTime field type to show date fields"
  scalar DateTime

  type Author {
    id: UUID!
    nickname: String!
  }

  type Post {
    id: UUID!
    title: String!
    body: String!
    published_at: DateTime!
    author: Author!
  }

  type PostsConnection {
    edges: [Post!]!
    cursor: String!
    lastPage: Boolean!
  }

  type Query {
    getPost(id: UUID!): Post

    listPosts(
      after: String
      pageSize: Int
    ): PostsConnection!
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

    signOut: Boolean!

    signUp(
      email: String!
      nickname: String!
      password: String!
    ): Boolean!
  }
`;
