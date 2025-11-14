# Setup Guide - NextGen CRM Frontend

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### 3. Configure Backend API

The frontend is configured to connect to a backend API running on `http://localhost:5000`. Make sure your backend server is running and the API endpoints match the expected structure.

## Project Structure Overview

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Navbar, Sidebar, Layout wrapper
│   ├── Activities/     # Activity timeline component
│   └── ProtectedRoute.jsx  # Route protection
├── pages/              # Page components
│   ├── Auth/          # Login, Register
│   ├── Dashboard/     # Analytics dashboard
│   └── Leads/         # Lead management pages
├── store/             # Redux store and slices
│   ├── slices/        # Individual state slices
│   └── store.js       # Store configuration
└── utils/             # Utilities
    ├── api.js         # Axios API client
    └── socket.js      # WebSocket client
```

## Features Implemented

### ✅ Authentication

- Login page with email/password
- Registration page with role selection
- JWT token management
- Protected routes
- Auto-logout on token expiry

### ✅ Role-Based Access Control

- Admin, Manager, Sales Executive roles
- Role-based menu items
- Role-based permissions (ready for backend integration)

### ✅ Lead Management

- Lead list with search and filtering
- Create new lead
- View lead details
- Edit lead information
- Delete lead
- Lead status management
- Lead source tracking

### ✅ Activity Timeline

- View all activities for a lead
- Add new activities (Note, Call, Meeting, Email, Task)
- Activity history tracking
- Scheduled activities support

### ✅ Dashboard

- Statistics cards (Total Leads, Active Leads, Converted, Activities)
- Lead status distribution (Pie chart)
- Lead source distribution (Bar chart)
- Monthly trends (Line chart)
- Real-time data updates

### ✅ Real-time Notifications

- WebSocket integration
- Notification center in navbar
- Unread notification count
- Real-time updates for lead changes and activities

### ✅ UI/UX

- Modern, responsive design
- Tailwind CSS styling
- Loading states
- Error handling
- Toast notifications
- Beautiful color scheme
- Intuitive navigation

## API Integration

The frontend expects the following API structure:

### Authentication Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Lead Endpoints

- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Activity Endpoints

- `GET /api/activities/lead/:leadId` - Get activities for a lead
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Dashboard Endpoints

- `GET /api/dashboard` - Get dashboard data

## WebSocket Events

The frontend listens for the following WebSocket events:

- `notification` - General notifications
- `leadUpdated` - Lead update notifications
- `activityCreated` - Activity creation notifications

## Environment Variables

Create a `.env` file (optional, defaults are set):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Testing the Frontend

Without a backend, you can test the UI by:

1. The app will show loading states when API calls fail
2. You can navigate through all pages
3. Forms are functional and validated
4. All UI components are interactive

## Next Steps

1. Set up the backend API server
2. Connect the frontend to the backend
3. Test all CRUD operations
4. Set up WebSocket server for real-time features
5. Configure email service for notifications
6. Add third-party integrations (optional)

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Vite will automatically use the next available port.

### API Connection Errors

Make sure your backend server is running on `http://localhost:5000` and CORS is properly configured.

### WebSocket Connection Issues

Ensure the WebSocket server is running and the socket URL is correct in `src/utils/socket.js`.

## Support

For issues or questions, please refer to the main README.md file.


