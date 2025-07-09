# InquireBlogApplication

A full-stack blog application with React Native mobile app and NestJS backend, featuring dark/light theme support, real-time search, image uploads, and comprehensive filtering system.

## Project Overview

This is a test project demonstrating modern mobile app development with the following features:

- **Mobile App**: React Native with Expo
- **Backend**: NestJS with TypeORM and PostgreSQL
- **State Management**: Zustand with persistence
- **Navigation**: React Navigation
- **Forms**: React Hook Form with Zod validation
- **UI**: Custom themed components with dark/light mode support

## Features

### Mobile App Features
- Dark/Light theme switching with persistent storage
- Real-time search functionality
- Advanced filtering system (by attachments, comments, viewed status)
- Image upload with preview
- Comments system with real-time updates
- Viewed posts tracking
- Swipe gestures for post actions
- Form validation
- Responsive design

### Backend Features
- RESTful API with NestJS
- TypeORM with PostgreSQL database
- File upload handling
- Comments management
- Posts CRUD operations

## Tech Stack

### Frontend (Mobile)
- React Native
- Expo
- TypeScript
- React Navigation
- Zustand (State Management)
- React Hook Form + Zod
- React Native SVG
- React Native Reanimated

### Backend
- NestJS
- TypeORM
- PostgreSQL
- Multer (File uploads)
- Class-validator

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **Git**
- **PostgreSQL** (see installation instructions below)

### Finding Your IPv4 Address

To connect your mobile device to the backend, you need your computer's IPv4 address:

#### Windows
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

#### macOS/Linux
```bash
ifconfig
# or
ip addr show
```
Look for "inet" followed by your local IP address (usually starts with 192.168.x.x or 10.0.x.x).

### PostgreSQL Installation

#### Windows
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. PostgreSQL will be available on port 5432

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Or download from postgresql.org
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Linux (CentOS/RHEL/Fedora)
```bash
sudo dnf install postgresql postgresql-server
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MakksymSly/InquireBlogApplication.git
cd InquireBlogApplication
```

### 2. Backend Setup

```bash
cd blog-backend
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database

1. Connect to PostgreSQL as the postgres user:

**Windows:**
```bash
# If you added PostgreSQL to PATH during installation
psql -U postgres

# Or navigate to PostgreSQL bin directory
cd "C:\Program Files\PostgreSQL\[version]\bin"
psql -U postgres
```

**macOS/Linux:**
```bash
sudo -u postgres psql
```

2. Create the database and user:
```sql
CREATE DATABASE blog_db;
CREATE USER blog_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE blog_db TO blog_user;
\q
```

**Note:** Replace `your_password` with a secure password of your choice.

### 4. Environment Configuration

#### Backend Environment Setup

1. Navigate to the backend directory:
```bash
cd blog-backend
```

2. Copy the environment example file:
```bash
cp env.example .env
```

3. Edit the `.env` file and update the following variables:
```env
# Replace with your local IPv4 address
CORS_ORIGIN=http://YOUR_IPV4_ADDRESS:3000

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=blog_user
DB_PASSWORD=your_password
DB_NAME=blog_db

# Server port
PORT=3000
NODE_ENV=development
```

**Important:** Replace `your_password` with the password you set when creating the database user.

#### Backend Environment Setup

1. Navigate to the backend directory:
```bash
cd blog-backend
```

2. Copy the environment example file:
```bash
cp env.example .env
```
#### Mobile App Environment Setup

1. Navigate to the mobile app directory:
```bash
cd blog-mobile
```

2. Copy the environment example file:
```bash
cp env.example .env
```

3. Edit the `.env` file and update the API base URL:
```env
# Replace with your local IPv4 address
API_BASE_URL=http://YOUR_IPV4_ADDRESS:3000
```

### 5. Mobile App Setup

```bash
cd blog-mobile
npm install
```

## Running the Application

### Backend Server

1. Navigate to the backend directory:
```bash
cd blog-backend
```

2. Start the development server:
```bash
npm run start:dev
```

The backend will be available at `http://localhost:3000` or `http://YOUR_IPv4:3000`

**Note:** The database tables will be created automatically when you first start the backend server.

### Mobile App

1. Navigate to the mobile app directory:
```bash
cd blog-mobile
```

2. Start the Expo development server:
```bash
npx expo start
```

3. Choose your preferred method to run the app:

#### Option A: Expo Go (Recommended for testing)
- Install Expo Go app on your phone
- Scan the QR code displayed in the terminal
- The app will load on your device

#### Option B: Android Emulator
```bash
npx expo start --android
```

#### Option C: iOS Simulator (macOS only)
```bash
npx expo start --ios
```

#### Option D: Web Version
```bash
npx expo start --web
```

## Initial Data Setup

After starting both the backend and mobile app for the first time:

1. **Create test posts** through the mobile app to test the CRUD functionality
2. **Upload images** to posts to test the file upload feature
3. **Add comments** to posts to test the comments system
4. **Test the filtering system** by creating posts with different characteristics:
   - Posts with and without images
   - Posts with and without comments
   - View posts to test the "viewed" filter

**Note:** Each developer will start with an empty database. The data you create will be stored locally in your PostgreSQL database.

## Project Structure

```
InquireBlogApplication/
├── blog-backend/                 # NestJS Backend
│   ├── src/
│   │   ├── posts/               # Posts module
│   │   ├── comments/            # Comments module
│   │   ├── upload/              # File upload module
│   │   └── main.ts              # Application entry point
│   └── uploads/                 # Uploaded images
├── blog-mobile/                 # React Native Mobile App
│   ├── src/
│   │   ├── api/                 # API client
│   │   ├── assets/              # Icons and images
│   │   ├── components/          # Reusable components
│   │   ├── hooks/               # Custom hooks
│   │   ├── navigation/          # Navigation setup
│   │   ├── screens/             # App screens
│   │   ├── store/               # Zustand stores
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Utility functions
│   └── App.tsx                  # App entry point
└── README.md
```

## Key Features Demo

### Theme Switching
- Navigate to Settings tab
- Toggle between Dark and Light themes
- Theme preference is automatically saved

### Post Management
- Create new posts with images
- Edit existing posts
- Delete posts with swipe gestures
- Search posts in real-time

### Advanced Filtering
- Tap the filter button (funnel icon)
- Filter by:
  - Posts with/without attachments
  - Posts with/without comments
  - Viewed/not viewed posts
- Filters are mutually exclusive within each category

### Comments System
- Add comments to posts
- View all comments for a post
- Delete comments
- Real-time comment count updates

## API Endpoints

### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

### Comments
- `GET /comments` - Get all comments
- `POST /comments` - Create new comment
- `DELETE /comments/:id` - Delete comment

### File Upload
- `POST /upload` - Upload image files

## Development Notes

### State Management
The app uses Zustand for state management with AsyncStorage persistence for theme preferences and viewed posts tracking.

### Theming System
Custom theming system with:
- Light theme: White background, dark text
- Dark theme: Dark background, light text
- Consistent color palette across all components

### Form Validation
React Hook Form with Zod schemas for:
- Post creation/editing
- Comment creation
- Input validation and error handling


## Contact

**Developer**: Maksym Seliutin
- **Email**: MaksymSeliutin.dev@gmail.com
- **GitHub**: [github.com/MakksymSly](https://github.com/MakksymSly)

