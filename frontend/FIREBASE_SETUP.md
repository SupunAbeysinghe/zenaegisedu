# Firebase Setup Guide

This guide will help you set up Firebase for authentication and resource management in the ZenAegis Edu application.

## Prerequisites

1. A Google account
2. A Firebase project (created in the next step)

## Setting up Firebase

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter "ZenAegis Edu" as the project name
4. Accept the terms and continue
5. Choose whether to enable Google Analytics (optional)
6. Click "Create project"

### 2. Register Your Web App

1. In the Firebase Console, click the web icon (</>) to register a web app
2. Enter "ZenAegis Edu" as the app nickname
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Save the Firebase configuration values for the next step

### 3. Enable Authentication

1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Click "Email/Password" and enable it
4. Click "Save"

### 4. Enable Firestore Database

1. In the Firebase Console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development only)
4. Choose a location near you
5. Click "Enable"

### 5. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace the placeholder values with your actual Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

### 6. Admin Access

To access the admin dashboard:
1. Sign up with an email ending in `@admin.com` (e.g., admin@example.com)
2. Navigate to `/admin` or click the "Admin" link in the header

## Features Implemented

- User authentication (sign up, login, logout)
- Admin dashboard for managing educational resources
- Protected routes for authenticated users and admins
- Real-time resource management with Firestore

## Security Note

For production use, you should:
1. Set up proper Firestore security rules
2. Use environment-specific configurations
3. Implement proper role-based access control
4. Add additional authentication providers as needed


