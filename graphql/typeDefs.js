const typeDefs = `
  type User {
      _id: ID!
      name: String
      password: String
      email: String
      posts: [Post]
      token: String
  }

  type Post {
    _id: ID!
    content: String
    image: String
    comment: [Comment]
    like: [User]
    userId: User
  }

  type Comment {
    _id: ID!
    content: String
    userId: User
  }

  type Query {
      user: User
      posts: [Post]
  }

  type Mutation {
    signUp(newUser: newUser): User
    signIn(email: String, password: String): User
    addPost(newPost: newPost): Post
    updatePost(postId: ID!,updatedPost: newPost): Post
    deletePost(postId: ID!): String
    addComment(newComment: newComment, postId: ID!): Comment
    updateComment(commentId: ID!, updatedComment: newComment): Post
    deleteComment(commentId: ID!, postId: ID!): String
    like(postId:ID!): String
    post(postId: ID!): Post
  }

  input newUser {
    name: String
    password: String
    email: String
  }

  input newPost {
    content: String
    image: String
  }

  input newComment {
    content: String
  }
`

module.exports = typeDefs