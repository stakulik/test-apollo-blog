# Apollo GraphQL Blog API

A modern TypeScript-based GraphQL blog API built with Apollo Server, Sequelize ORM, and PostgreSQL. This system provides comprehensive blog functionality including user authentication, post management, commenting, and background job processing for content moderation.

## Key Features

### Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Secure password hashing** with bcrypt
- **Token refresh mechanism** for seamless user experience
- **Protected GraphQL resolvers** with authentication middleware

### Blog Management
- **User registration and authentication** with email validation
- **Post creation and management** with rich text content
- **Comment system** for user engagement
- **Author-post relationships** with efficient data loading

### Advanced Features
- **Background job processing** with Bull Queue and Redis
- **Content moderation system** with automated timestamping
- **Cursor-based pagination** for efficient data retrieval
- **GraphQL field resolvers** with batch loading to prevent N+1 queries
- **Comprehensive validation** for all inputs

## Technology Stack

### Backend Framework
- **Apollo Server**: Modern GraphQL server implementation
- **TypeScript**: Static typing for enhanced developer experience
- **Sequelize ORM**: Database abstraction with model relationships

### Database
- **PostgreSQL**: Robust relational database with UUID primary keys
- **Database migrations**: Version-controlled schema changes
- **Redis**: Background job queue and caching

### Security
- **JWT**: JSON Web Tokens for stateless authentication
- **bcrypt**: Password hashing and verification
- **Input validation**: Comprehensive request validation

### Development Tools
- **ESLint**: Code linting and formatting
- **Mocha + Chai**: Comprehensive testing framework
- **Factory Girl**: Test data generation
- **Docker Compose**: Containerized development environment

## Database Schema

### Core Entities

```sql
Users
├── id (UUID, Primary Key)
├── email (String, Unique)
├── nickname (String)
├── password (String, Hashed)
├── created_at (DateTime)
└── updated_at (DateTime)

Posts
├── id (UUID, Primary Key)
├── title (String)
├── body (Text)
├── published_at (DateTime)
├── moderated_at (DateTime, Nullable)
├── user_id (UUID, Foreign Key -> Users.id)
├── created_at (DateTime)
└── updated_at (DateTime)

Comments
├── id (UUID, Primary Key)
├── body (Text)
├── published_at (DateTime)
├── user_id (UUID, Foreign Key -> Users.id)
├── post_id (UUID, Foreign Key -> Posts.id)
├── created_at (DateTime)
└── updated_at (DateTime)

AuthTokens
├── id (UUID, Primary Key)
├── token (String)
├── user_id (UUID, Foreign Key -> Users.id)
├── created_at (DateTime)
└── updated_at (DateTime)
```

### Relationships
- **Users** have many **Posts** (one-to-many)
- **Users** have many **Comments** (one-to-many)
- **Posts** have many **Comments** (one-to-many)
- **Users** have many **AuthTokens** (one-to-many)

## GraphQL API

### Queries
- `getPost(id: UUID!)` - Retrieve a specific post by ID
- `listPosts(after: String, pageSize: Int)` - List posts with cursor-based pagination

### Mutations
- `signUp(email: String!, nickname: String!, password: String!)` - User registration
- `signIn(email: String!, password: String!)` - User authentication (returns JWT)
- `signOut` - User logout (invalidates refresh token)
- `createPost(title: String!, body: String!, published_at: DateTime)` - Create new blog post

### Types
- **Post**: Blog post with title, body, publication date, and author
- **Author**: User information (id, nickname) for post attribution
- **PostsConnection**: Paginated post results with cursor and pagination info

## Installation & Setup

### Prerequisites
- Node.js (v20.5.1)
- PostgreSQL
- Redis
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd test-apollo-blog
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Configure DATABASE_URL, JWT_SECRET, and PORT
   ```

4. **Database setup**
   ```bash
   # Start PostgreSQL and Redis with Docker
   docker-compose up -d
   
   # Run database migrations
   yarn migrate
   ```

5. **Start the application**
   ```bash
   # Development
   yarn build && yarn start:api
   
   # With debugging
   yarn build && yarn start:api:debug
   ```

## Testing

The project includes comprehensive testing covering repositories, services, and GraphQL resolvers.

### Test Categories
- **Repository Tests**: Data access layer testing with Sequelize
- **Service Tests**: Business logic validation
- **Resolver Tests**: GraphQL endpoint testing with authentication
- **Integration Tests**: End-to-end API testing

### Running Tests
```bash
# Run all tests
yarn test

# Recreate test database
yarn test:db:recreate

# Run specific test files
yarn test test/services/user.service.test.ts
```

### Test Infrastructure
- **Factory Pattern**: Consistent test data generation with Factory Girl
- **Database Isolation**: Clean database state for each test
- **Authentication Testing**: JWT token validation in test scenarios

## Development Commands

```bash
# Database operations
yarn migrate              # Run database migrations
yarn migrate:undo         # Rollback last migration

# Development
yarn build                # Compile TypeScript to dist/
yarn start:api            # Start API server
yarn start:api:debug      # Start with debugger

# Code quality
yarn lint                 # Run ESLint
yarn clean                # Remove dist/ directory

# Testing
yarn test                 # Run all tests
yarn test:db:recreate     # Recreate test database
```

## Architecture

### Modular Structure
```
src/
├── auth/           # JWT authentication logic
├── config/         # App configuration and GraphQL schema
├── db/             # Database connection and configuration
├── lib/            # Shared utilities (JWT, GraphQL errors)
├── models/         # Sequelize models (User, Post, Comment, AuthToken)
├── queues/         # Background job processing with Bull
├── repositories/   # Data access layer with CRUD operations
├── resolvers/      # GraphQL resolvers (queries, mutations, fields)
├── server/         # Apollo Server setup and configuration
└── services/       # Business logic layer
```

### Design Patterns
- **Layered Architecture**: Clear separation between data, business, and presentation layers
- **Repository Pattern**: Database abstraction with Sequelize ORM
- **Factory Pattern**: Test data generation and dependency injection
- **Batch Resolution**: GraphQL field resolvers with batching to prevent N+1 queries
- **Queue Pattern**: Background job processing for content moderation

## Background Jobs

The system uses Bull Queue with Redis for background processing:

### Post Moderation
- **Automatic moderation**: Posts are queued for moderation after creation
- **Moderation timestamps**: `moderated_at` field tracks processing status
- **Scalable processing**: Queue workers can be scaled independently

### Queue Configuration
```typescript
// Queue processing with Redis
const postsQueue = new Bull('posts processing', REDIS_URL);

// Add moderation job
addModerationJob(postId);
```

## Security Features

- **Password Encryption**: bcrypt with configurable salt rounds
- **JWT Security**: Access token with configurable expiration
- **Input Validation**: Comprehensive validation for all GraphQL inputs
- **SQL Injection Prevention**: Sequelize ORM parameterized queries
- **Authentication Guards**: Protected resolvers require valid JWT tokens

## Performance Optimizations

- **Cursor Pagination**: Efficient pagination for large datasets
- **Batch Resolution**: Prevents N+1 query problems in GraphQL
- **Database Indexing**: Strategic indexes on foreign keys and frequently queried fields
- **Connection Pooling**: Optimized database connections with Sequelize
- **Background Processing**: Non-blocking content moderation with Redis queues

## Node Version

This project requires Node.js version 20.5.1 (specified in package.json engines).
