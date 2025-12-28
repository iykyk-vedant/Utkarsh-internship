# ResolveIt - Complaint & Issue Tracking System

ResolveIt is a comprehensive web application that allows users to raise complaints/issues, track their status, and enables admins to manage and resolve issues. The application features secure authentication and a clean, functional UI.

## 🧩 Features

- **User Registration & Login**: Secure authentication using Supabase
- **Complaint Management**: Create, view, update, and delete complaints
- **Role-based Access**: Different views and permissions for users and admins
- **Status Tracking**: Track complaint status (Pending, In Progress, Resolved)
- **Admin Dashboard**: Admins can manage all complaints and update their status
- **Responsive UI**: Clean, modern interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Supabase
- **Styling**: Tailwind CSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Supabase account

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/iykyk-vedant/Utkarsh-internship.git
cd Utkarsh-internship
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following content:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resolveit?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_must_be_long_and_random
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory with the following content:

```env
# Supabase Configuration for Frontend
REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api

# Other frontend environment variables
REACT_APP_TITLE=ResolveIt - Complaint Tracking System
```

Start the frontend development server:

```bash
npm start
```

The application will be accessible at `http://localhost:3000`

## 📖 Environment Variables

### Backend (.env)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time
- `PORT`: Port number for the backend server

### Frontend (.env)
- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon key
- `REACT_APP_API_URL`: URL of your backend API

## 🔐 Authentication Flow

1. **Signup Flow**: User enters email & password → Account is created → User is logged in automatically → Redirect to dashboard
2. **Login Flow**: User enters credentials → Auth is verified via Supabase → User lands on dashboard
3. **Admin Access**: Admin users (with specific email or role) can access admin dashboard

## 🏗️ Project Structure

```
ResolveIt/
├── backend/
│   ├── controllers/      # Request handling logic
│   ├── models/          # Database models
│   ├── routes/          # API route definitions
│   ├── middleware/      # Authentication and other middleware
│   ├── config/          # Configuration files
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── public/          # Public assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   ├── utils/       # Utility functions
│   │   ├── App.js       # Main application component
│   │   └── index.js     # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── .env                 # Environment variables (not committed)
├── .env.example         # Example environment variables
└── README.md
```

## 🧪 User Flows

### Regular User
1. **Signup**: Create an account with email and password
2. **Login**: Authenticate and access the dashboard
3. **Create Complaint**: Submit a new complaint with title, description, and category
4. **View Complaints**: See all their complaints with status updates
5. **Update/Delete Complaints**: Modify or remove their own complaints

### Admin
1. **Login**: Authenticate as an admin
2. **View All Complaints**: Access the admin dashboard to see all complaints
3. **Update Status**: Change complaint status (Pending → In Progress → Resolved)

## 🚀 Deployment

### Deploying Backend to Production
1. Set up environment variables on your hosting platform
2. Build the project: `npm run build`
3. Deploy to your preferred Node.js hosting platform (Heroku, AWS, etc.)

### Deploying Frontend to Production
1. Set up environment variables
2. Build the project: `npm run build`
3. Deploy the `build` folder to your preferred hosting platform (Netlify, Vercel, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Project Link: [https://github.com/iykyk-vedant/Utkarsh-internship](https://github.com/iykyk-vedant/Utkarsh-internship)

---

Built with ❤️ for the Utkarsh Internship Program