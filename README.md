# PoeClub - Social Messaging Platform

A modern social messaging platform built with React.js frontend and Node.js backend, featuring user authentication, real-time messaging, and a clean user interface.

## 🚀 Features

- **User Authentication**: Secure login/register system with password hashing
- **Real-time Messaging**: Post and view messages instantly
- **User Profiles**: Display user aliases with each message
- **Session Management**: Persistent login sessions with localStorage
- **Protected Routes**: Authentication required for posting messages
- **Clean UI**: Modern dark theme with elegant borders and typography

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Context API** - Global state management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📁 Project Structure

```
VipClub/
├── database/
│   └── db.js              # Database configuration
├── middlewares/
│   └── sessioncheck.js    # Authentication middleware
├── public/
│   └── crown.webp         # Static assets
├── routes/
│   ├── login.js           # Login API endpoint
│   ├── message.js         # Messages API endpoint
│   ├── post.js            # Post creation endpoint
│   └── register.js        # Registration endpoint
├── src/
│   ├── assets/
│   │   ├── crown.webp
│   │   └── eap.png
│   ├── Authcontext.jsx    # Global authentication state
│   ├── index.css          # Global styles
│   ├── Login.jsx          # Login component
│   ├── main.jsx           # React app entry point
│   ├── Messages.jsx       # Messages display component
│   ├── Navbar.jsx         # Navigation component
│   ├── Post.jsx           # Post creation component
│   └── Register.jsx       # Registration component
├── .gitignore
├── app.js                 # Backend server entry point
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── README.md              # Project documentation
└── vite.config.js         # Vite configuration
```

## 🔗 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Messages
- `GET /api/messages` - Fetch all messages
- `POST /api/post` - Create new message (requires authentication)

## 🎨 Features Overview

### User Authentication
- Secure registration with password hashing
- Login with username/password
- Session persistence with localStorage
- Protected routes for authenticated users

### Messaging System
- Post messages with user alias
- View all messages in chronological order
- Real-time message display
- Anonymous viewing for non-authenticated users

## 🔧 Configuration

### Custom Header Authentication
The application uses custom `x-user-alias` headers for authentication:

```javascript
headers: {
  'Content-Type': 'application/json',
  'x-user-alias': userAlias
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Utaxy**
- GitHub: [@Utaxy](https://github.com/Utaxy)

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Tailwind CSS for utility-first styling approach
- PostgreSQL for reliable database management
- Express.js for robust backend framework

---

⭐ Star this repository if you found it helpful!