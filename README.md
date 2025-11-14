# NextGen CRM - Modern Customer Relationship Management System

A modern, scalable CRM platform built with the MERN stack (MongoDB/PostgreSQL, Express, React, Node.js) designed for fast-scaling startups that need real-time insights, automated follow-ups, and collaborative workflows.

## Features

### ✅ Core Features Implemented

- **Authentication & Role Management**

  - JWT-based authentication
  - Role-based access control (Admin, Manager, Sales Executive)
  - Secure login and registration

- **Lead Management**

  - Full CRUD operations for leads
  - Lead ownership tracking
  - Lead status management (New, Contacted, Qualified, Proposal, Negotiation, Won, Lost)
  - Lead source tracking
  - Advanced search and filtering

- **Activity Timeline**

  - Detailed activity log per lead
  - Support for multiple activity types (Notes, Calls, Meetings, Emails, Tasks)
  - Scheduled activities
  - Activity history trail

- **Dashboard & Analytics**

  - Performance metrics visualization
  - Lead status distribution charts
  - Lead source distribution
  - Monthly trends analysis
  - Real-time statistics

- **Real-time Notifications**

  - WebSocket integration for real-time updates
  - Notification system for lead updates and activities
  - Unread notification count

- **Modern UI/UX**
  - Responsive design
  - Beautiful and intuitive interface
  - Tailwind CSS for styling
  - React Icons for icons

## Tech Stack

### Frontend

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.io-client** - WebSocket client
- **React Hot Toast** - Notifications
- **Vite** - Build tool

### Backend (To be implemented)

- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Socket.io** - WebSocket server
- **Nodemailer** - Email service

## Project Structure

```
nextgen-crm-frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout/         # Layout components (Navbar, Sidebar)
│   │   └── Activities/     # Activity components
│   ├── pages/              # Page components
│   │   ├── Auth/          # Authentication pages
│   │   ├── Dashboard/     # Dashboard page
│   │   └── Leads/         # Lead management pages
│   ├── store/             # Redux store
│   │   ├── slices/        # Redux slices
│   │   └── store.js       # Store configuration
│   ├── utils/             # Utility functions
│   │   ├── api.js         # API client
│   │   └── socket.js      # WebSocket client
│   ├── App.jsx            # Main App component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── package.json           # Dependencies
└── vite.config.js        # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## API Endpoints (Backend to be implemented)

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Leads

- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Activities

- `GET /api/activities/lead/:leadId` - Get activities for a lead
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Dashboard

- `GET /api/dashboard` - Get dashboard data

## Role-Based Access Control

- **Admin**: Full access to all features
- **Manager**: Access to leads, activities, and dashboard
- **Sales Executive**: Access to assigned leads and activities

## Future Enhancements

- [ ] Email integration
- [ ] Automated email triggers
- [ ] Third-party integrations (HubSpot, Slack)
- [ ] Advanced reporting
- [ ] Export functionality
- [ ] Mobile app
- [ ] AI-powered lead scoring

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Authors

- Your Name

## Acknowledgments

- Masters' Union for the challenge
- All open-source contributors


