# Notes API Backend

A RESTful API for managing notes with PostgreSQL database integration and Prometheus metrics.

## Features

- **CRUD Operations**: Create, Read, Update, Delete notes
- **PostgreSQL Integration**: Database connection with automatic table creation
- **Prometheus Metrics**: Built-in monitoring and metrics collection
- **Health Checks**: Health endpoint for monitoring
- **CORS Support**: Cross-origin resource sharing enabled
- **Docker Support**: Containerized application

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and available endpoints |
| GET | `/health` | Health check endpoint |
| GET | `/metrics` | Prometheus metrics |
| GET | `/notes` | Get all notes |
| GET | `/notes/:id` | Get specific note by ID |
| POST | `/notes` | Create new note |
| PUT | `/notes/:id` | Update existing note |
| DELETE | `/notes/:id` | Delete note |

## Environment Variables

```bash
PORT=3000                    # Server port (default: 3000)
DB_HOST=localhost           # Database host
DB_PORT=5432               # Database port (default: 5432)
DB_NAME=notesdb            # Database name (default: notesdb)
DB_USER=postgres           # Database username (default: postgres)
DB_PASSWORD=password       # Database password
```

## Database Schema

```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Installation & Setup

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set environment variables**:
   ```bash
   export DB_HOST=your-db-host
   export DB_PASSWORD=your-db-password
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Start production server**:
   ```bash
   npm start
   ```

### Docker Deployment

1. **Build Docker image**:
   ```bash
   docker build -t notes-api .
   ```

2. **Run container**:
   ```bash
   docker run -p 3000:3000 \
     -e DB_HOST=your-db-host \
     -e DB_PASSWORD=your-db-password \
     notes-api
   ```

## API Usage Examples

### Create Note
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "My Note", "content": "Note content"}'
```

### Get All Notes
```bash
curl http://localhost:3000/notes
```

### Get Specific Note
```bash
curl http://localhost:3000/notes/1
```

### Update Note
```bash
curl -X PUT http://localhost:3000/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Note", "content": "Updated content"}'
```

### Delete Note
```bash
curl -X DELETE http://localhost:3000/notes/1
```

## Dependencies

- **express**: Web framework
- **pg**: PostgreSQL client
- **cors**: CORS middleware
- **prom-client**: Prometheus metrics
- **dotenv**: Environment variable management

## Monitoring

The application exposes Prometheus metrics at `/metrics` endpoint including:
- HTTP request counters
- Default Node.js metrics
- Custom application metrics

## Health Check

Health status available at `/health` endpoint returning:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
