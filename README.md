# 🚀 Retro Chat Terminal

A cyberpunk-themed real-time chat application with a retro terminal aesthetic. Create secure chat sessions and invite friends using public links or session credentials.

![Retro Chat Terminal](https://img.shields.io/badge/Status-Active-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![Encore.ts](https://img.shields.io/badge/Encore.ts-Backend-blue) ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)

## ✨ Features

- **🔒 Secure Sessions**: Password-protected chat rooms with unique session IDs
- **🔗 Public Links**: Generate shareable links for instant access
- **🎨 Retro UI**: Cyberpunk terminal aesthetic with glitch effects
- **⚡ Real-time**: WebSocket-based streaming for instant messaging
- **🌈 User Colors**: Customizable user colors for easy identification
- **📱 Responsive**: Works on desktop and mobile devices
- **🛡️ Type-safe**: Full TypeScript implementation with Encore.ts

## 🏗️ Tech Stack

### Backend
- **Encore.ts**: TypeScript backend framework
- **PostgreSQL**: Database for session management
- **WebSockets**: Real-time bidirectional streaming
- **SQL Migrations**: Database schema management

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first styling
- **shadcn/ui**: Pre-built UI components
- **React Router**: Client-side routing
- **Lucide React**: Icon library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- **Encore CLI** - We'll install this in the setup steps

## 🚀 Installation & Setup

### Step 1: Install Encore CLI

```bash
# Install Encore CLI globally
npm install -g @encore/cli

# Verify installation
encore version
```

### Step 2: Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url>
cd retro-chat-app

# Or if you're starting fresh, create a new Encore app
encore app create retro-chat-app
cd retro-chat-app
```

### Step 3: Project Structure Setup

If you're starting fresh, create the following project structure:

```
retro-chat-app/
├── backend/
│   └── chat/
│       ├── encore.service.ts
│       ├── db.ts
│       ├── create_session.ts
│       ├── join_session.ts
│       ├── get_session_by_link.ts
│       ├── stream.ts
│       └── migrations/
│           ├── 1_create_sessions.up.sql
│           └── 2_add_public_link.up.sql
├── frontend/
│   ├── App.tsx
│   ├── index.css
│   └── components/
│       ├── ChatWindow.tsx
│       ├── JoinByLink.tsx
│       ├── MessageInput.tsx
│       ├── SessionSetup.tsx
│       └── Terminal.tsx
└── README.md
```

### Step 4: Install Dependencies

```bash
# Install all dependencies (this happens automatically with Encore)
# Encore will install both backend and frontend dependencies
```

### Step 5: Database Setup

The database will be automatically created when you run the application. The migrations will set up the required tables:

- `chat_sessions`: Stores session information, passwords, and public link IDs
- Automatic indexing on session IDs and public link IDs

### Step 6: Development Setup

```bash
# Start the development server
encore run

# This will start both:
# - Backend API server (typically on port 4000)
# - Frontend development server (typically on port 3000)
# - PostgreSQL database (managed by Encore)
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Encore Dashboard**: http://localhost:9400

## 🌐 Deployment

### Option 1: Deploy to Encore Cloud (Recommended)

```bash
# Create an app on Encore Cloud
encore app create your-app-name

# Deploy to production
encore deploy

# Your app will be available at:
# https://your-app-name-xxxx.encr.app
```

### Option 2: Deploy to Other Platforms

You can also deploy to:
- **Vercel**
- **Railway** 
- **Render**
- **Heroku**
- **DigitalOcean App Platform**

**Important**: After deploying, update the `baseUrl` in `backend/chat/create_session.ts`:

```typescript
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-actual-deployed-domain.com' // Replace with your deployed URL
  : 'http://localhost:3000';
```

## 📖 How to Use

### Creating a Chat Session

1. **Open the Application**: Navigate to your deployed URL or http://localhost:3000
2. **Host Session Tab**: Click on "HOST SESSION"
3. **Fill Details**:
   - Enter your **Host Name** (displayed to other users)
   - Create a **Session Password** (required for others to join)
4. **Click "CREATE SESSION"**: This generates:
   - **Session ID**: 8-character unique identifier
   - **Public Link**: Direct link for instant access
   - **Password**: The password you created
5. **Copy & Share**: 
   - Copy the **Public Link** for instant access
   - Or share the **Session ID** and **Password** for manual entry
6. **Join Your Session**:
   - Enter your **Username**
   - Choose your **Color**
   - Click "JOIN YOUR SESSION"

### Joining a Chat Session

#### Method 1: Using Public Link
1. **Click the Public Link** shared by the host
2. **Enter Username**: Choose your display name
3. **Select Color**: Pick your message color
4. **Click "JOIN SESSION"**: You'll be connected instantly

#### Method 2: Manual Entry
1. **Open the Application**
2. **Join Session Tab**: Click on "JOIN SESSION"
3. **Enter Details**:
   - **Session ID**: 8-character code from host
   - **Password**: Session password from host
   - **Username**: Your display name
   - **Color**: Your message color
4. **Click "JOIN SESSION"**: Connect to the chat

### Using the Chat

- **Send Messages**: Type in the input field and press Enter or click Send
- **View Messages**: All messages appear in real-time with timestamps
- **User Identification**: Each user has a unique color and username
- **Session Info**: View session ID, host name, and your username in the header
- **Disconnect**: Click "DISCONNECT" to leave the session

## 🔧 Configuration

### Environment Variables

For production deployment, you may need to set:

```bash
# Frontend URL (for public link generation)
FRONTEND_URL=https://your-domain.com

# Node environment
NODE_ENV=production
```

### Customization

#### Colors
Edit the `retroColors` array in components to change available user colors:

```typescript
const retroColors = [
  "#00ff00", // Green
  "#ff00ff", // Magenta
  "#00ffff", // Cyan
  "#ffff00", // Yellow
  // Add more colors...
];
```

#### Styling
- Modify `frontend/index.css` for global styles
- Update Tailwind classes in components for UI changes
- Customize the glitch effect animations

## 🛠️ Development

### Project Structure

```
backend/chat/
├── encore.service.ts     # Service definition
├── db.ts                 # Database connection
├── create_session.ts     # Create new sessions
├── join_session.ts       # Join existing sessions
├── get_session_by_link.ts # Get session by public link
├── stream.ts             # Real-time chat streaming
└── migrations/           # Database migrations

frontend/
├── App.tsx              # Main app with routing
├── components/
│   ├── ChatWindow.tsx   # Message display
│   ├── SessionSetup.tsx # Session creation/joining
│   ├── JoinByLink.tsx   # Public link joining
│   ├── MessageInput.tsx # Message input field
│   └── Terminal.tsx     # Retro terminal header
└── index.css           # Global styles
```

### API Endpoints

- `POST /chat/sessions` - Create new session
- `POST /chat/sessions/join` - Join existing session
- `GET /chat/sessions/link/:linkId` - Get session by public link
- `WebSocket /chat/stream` - Real-time messaging

### Database Schema

```sql
-- chat_sessions table
CREATE TABLE chat_sessions (
  id TEXT PRIMARY KEY,              -- Session ID (8 chars)
  host_name TEXT NOT NULL,          -- Host display name
  password TEXT NOT NULL,           -- Session password
  public_link_id TEXT UNIQUE,       -- UUID for public links
  created_at TIMESTAMP DEFAULT NOW, -- Creation timestamp
  is_active BOOLEAN DEFAULT TRUE    -- Session status
);
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to connect to chat"
- **Check**: Ensure the backend is running
- **Solution**: Run `encore run` and verify both frontend and backend are started

#### 2. "Session not found"
- **Check**: Verify the session ID is correct (8 characters)
- **Solution**: Double-check the session ID or create a new session

#### 3. "Invalid password"
- **Check**: Ensure the password matches exactly
- **Solution**: Copy the password directly from the host

#### 4. Clipboard copy not working
- **Issue**: Browser security restrictions
- **Solution**: The app includes fallback - manually select and copy the highlighted text

#### 5. Public links not working
- **Check**: Ensure the `baseUrl` in `create_session.ts` matches your deployed domain
- **Solution**: Update the URL after deployment

### Development Issues

#### Database Connection
```bash
# Reset database if needed
encore db reset

# View database
encore db shell
```

#### Port Conflicts
```bash
# Check what's running on ports
lsof -i :3000
lsof -i :4000

# Kill processes if needed
kill -9 <PID>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add feature"`
6. Push: `git push origin feature-name`
7. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. **Check this README** for common solutions
2. **Review the Troubleshooting section**
3. **Check Encore.ts documentation**: https://encore.dev/docs
4. **Create an issue** in the repository with:
   - Error messages
   - Steps to reproduce
   - Your environment details

## 🎯 Roadmap

Future enhancements planned:
- [ ] File sharing capabilities
- [ ] Message history persistence
- [ ] User authentication
- [ ] Private messaging
- [ ] Session moderation tools
- [ ] Mobile app versions
- [ ] Voice/video chat integration

---

**Happy Chatting! 🚀**

*Built with ❤️ using Encore.ts and React*
