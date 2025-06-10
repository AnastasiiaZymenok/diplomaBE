# TCNEXS Backend

A Node.js Express backend for the TCNEXS application that manages company profiles, announcements, and projects.

## Features

- User authentication with JWT
- Company profile management
- Announcements (search/offer)
- Project management
- File uploads for company photos
- Role-based access control
- Input validation
- Error handling
- Rate limiting
- CORS configuration

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tcnexs-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=tcnexs_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880 # 5MB in bytes

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

4. Create the uploads directory:

```bash
mkdir uploads
```

5. Run database migrations:

```bash
npm run migration:run
```

## Development

Start the development server:

```bash
npm run dev
```

## Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Documentation

### Authentication

- POST /api/auth/register - Register new user and company
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/me - Get current user info

### Company

- GET /api/companies/:id - Get company details
- PUT /api/companies/:id - Update company details
- POST /api/companies/:id/photo - Upload company profile photo

### Announcements

- GET /api/announcements - Get all announcements
- GET /api/announcements/:id - Get specific announcement
- POST /api/announcements - Create new announcement
- PUT /api/announcements/:id - Update announcement
- DELETE /api/announcements/:id - Delete announcement

### Projects

- GET /api/projects - Get all projects
- GET /api/projects/:id - Get specific project
- POST /api/projects - Create new project (admin only)
- PUT /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project

## Testing

Run tests:

```bash
npm test
```

## Error Handling

The API uses a consistent error response format:

```json
{
  "status": "error",
  "message": "Error message"
}
```

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- Rate limiting
- CORS configuration
- SQL injection prevention with TypeORM
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
