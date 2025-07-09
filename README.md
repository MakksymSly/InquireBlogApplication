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
- TypeORM with SQLite database
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
- SQLite
- Multer (File uploads)
- Class-validator

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **Git**

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

### 3. Environment Configuration

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

### 4. Mobile App Setup

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

