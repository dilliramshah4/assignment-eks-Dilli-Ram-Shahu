# Notes App Frontend

A React-based frontend application for managing notes with full CRUD operations. The app provides a clean, responsive interface for creating, reading, updating, and deleting notes.

## Features

- **Create Notes**: Add new notes with title and content
- **View Notes**: Display all notes in a responsive grid layout
- **Edit Notes**: Update existing notes inline
- **Delete Notes**: Remove notes with confirmation
- **Real-time Updates**: Automatic refresh after operations
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful error handling for API calls

## Technology Stack

- **React 18.2.0**: Frontend framework
- **Axios 1.6.0**: HTTP client for API calls
- **CSS3**: Custom styling with responsive design
- **Docker**: Containerized deployment with Nginx
- **Environment Variables**: Configurable API endpoints

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js             # Main React component
│   ├── App.css            # Application styles
│   └── index.js           # React entry point
├── Dockerfile             # Multi-stage Docker build
├── package.json           # Dependencies and scripts
└── .env                   # Environment configuration
```

## API Integration

The frontend communicates with the backend API through the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | Fetch all notes |
| POST | `/notes` | Create new note |
| PUT | `/notes/:id` | Update existing note |
| DELETE | `/notes/:id` | Delete note |

## Environment Configuration

Configure the backend API URL in `.env`:

```bash
REACT_APP_API_URL=http://localhost:3000
```

For production deployment, update with your backend service URL.

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Update REACT_APP_API_URL with your backend URL
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Access application**:
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build production bundle
- `npm run serve` - Serve production build locally

## Docker Deployment

### Build Docker Image

```bash
docker build -t notes-frontend .
```

### Run Container

```bash
docker run -p 80:80 notes-frontend
```

### Multi-stage Build

The Dockerfile uses a multi-stage build process:

1. **Build Stage**: Compiles React app using Node.js
2. **Production Stage**: Serves static files using Nginx

## Component Architecture

### App.js - Main Component

**State Management**:
- `notes`: Array of all notes
- `title`: Current note title input
- `content`: Current note content input
- `editingId`: ID of note being edited

**Key Functions**:
- `fetchNotes()`: Retrieves all notes from API
- `handleSubmit()`: Creates or updates notes
- `handleEdit()`: Switches to edit mode
- `handleDelete()`: Removes notes

**UI Features**:
- Form for note input/editing
- Grid layout for note display
- Action buttons for each note
- Responsive design elements

## Styling

### CSS Features

- **Responsive Grid**: Adapts to different screen sizes
- **Card Layout**: Clean note presentation
- **Form Styling**: User-friendly input fields
- **Button States**: Visual feedback for interactions
- **Mobile-First**: Optimized for mobile devices

### Key CSS Classes

- `.App`: Main application container
- `.note-form`: Note input form styling
- `.notes-grid`: Responsive grid layout
- `.note-card`: Individual note styling
- `.note-actions`: Button container

## Production Deployment

### Build Process

```bash
# Create production build
npm run build

# Files generated in build/ directory
# Ready for static hosting
```

### Nginx Configuration

The Docker image uses Nginx with default configuration suitable for React SPA:

- Serves static files from `/usr/share/nginx/html`
- Handles client-side routing
- Optimized for production performance

## API Error Handling

The application includes comprehensive error handling:

```javascript
try {
  const response = await axios.get(`${API_URL}/notes`);
  setNotes(response.data);
} catch (error) {
  console.error('Error fetching notes:', error);
  // Could add user notification here
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance Optimizations

- **Code Splitting**: React lazy loading ready
- **Static Assets**: Optimized build process
- **Nginx Compression**: Gzip enabled in production
- **Caching**: Browser caching headers configured

## Future Enhancements

- User authentication
- Note categories/tags
- Search functionality
- Rich text editor
- Offline support
- Real-time collaboration

## Troubleshooting

### Common Issues

1. **API Connection Failed**:
   - Check REACT_APP_API_URL in .env
   - Verify backend is running
   - Check CORS configuration

2. **Build Errors**:
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Docker Issues**:
   - Ensure Docker is running
   - Check port availability (80)
   - Verify Dockerfile syntax

### Development Tips

- Use browser dev tools for debugging
- Check network tab for API calls
- Monitor console for errors
- Test responsive design on different devices
