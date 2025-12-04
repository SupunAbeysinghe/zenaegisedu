# Firebase Security Rules Fix

The "Missing or insufficient permissions" error occurs because Firestore security rules are preventing read/write operations. Here's how to fix it:

## Option 1: Update Firestore Security Rules (Recommended for Development)

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on "Firestore Database" in the left sidebar
4. Click on the "Rules" tab
5. Replace the existing rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

6. Click "Publish"

## Option 2: Update Rules with Basic Authentication (Recommended for Production)

Replace the existing rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all users
    match /{document=**} {
      allow read: if true;
      // Allow write access only to authenticated users
      allow write: if request.auth != null;
    }
  }
}
```

## Option 3: More Granular Rules Based on Collections

For more control, use these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Resources collection - allow read for all, write for authenticated
    match /resources/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Grade categories collection - allow read for all, write for authenticated
    match /gradeCategories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Understanding the Error

The error occurs because:
1. Firebase Firestore requires explicit security rules to allow read/write operations
2. By default, new Firestore databases deny all access
3. The application tries to read/write data without proper permissions

## Testing the Fix

After updating the rules:
1. Refresh your application
2. The permission errors should disappear
3. You should be able to:
   - View grade categories
   - Edit grade images in the admin panel
   - Add/delete resources

## Security Note

For production environments, you should implement more restrictive rules based on user roles and authentication to prevent unauthorized access to your data.