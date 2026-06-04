# Auth0 + Supabase Integration Setup Guide

## 🚀 Quick Setup Steps

### 1. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to **Settings** → **API**
3. Copy your **Project URL** and **anon/public key**

### 2. Update Supabase Configuration

Open `src/lib/supabase.js` and replace the placeholder values:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL'     // Replace with your Project URL
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'        // Replace with your anon key
```

### 3. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` and run it
3. This will create the necessary tables and security policies

### 4. Configure Auth0 + Supabase Integration (Optional)

For enhanced security, you can configure Supabase to work directly with Auth0:

1. In Supabase, go to **Authentication** → **Settings**
2. Add Auth0 as an external provider
3. Configure the JWT settings to accept Auth0 tokens

## 🔧 What This Integration Provides

### Features:
- ✅ **User Sync**: Automatically syncs Auth0 users to Supabase
- ✅ **Database Storage**: Store additional user data in Supabase
- ✅ **Real-time Data**: Use Supabase real-time features
- ✅ **Row Level Security**: Secure data access per user
- ✅ **Scalable Backend**: Full PostgreSQL database

### Architecture:
```
Auth0 (Authentication) → React App → Supabase (Database)
```

## 📊 Database Tables Created

### `users` table:
- `id`: UUID primary key
- `auth0_id`: Auth0 user ID (unique)
- `email`: User email
- `name`: User name
- `picture`: Profile picture URL
- `email_verified`: Email verification status
- `created_at` / `updated_at`: Timestamps

### `posts` table (example):
- `id`: UUID primary key
- `user_id`: Reference to users table
- `title`: Post title
- `content`: Post content
- `created_at` / `updated_at`: Timestamps

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **JWT Integration**: Supabase can validate Auth0 tokens
- **Automatic User Sync**: New Auth0 users are automatically added to Supabase

## 🚦 How to Use

1. **Update Configuration**: Replace the Supabase URL and key
2. **Run Database Schema**: Execute the SQL in Supabase
3. **Test Login**: Users will now be synced to Supabase automatically
4. **Build Features**: Use the Supabase client to add more features

## 📝 Example Usage

```javascript
import { supabase } from './lib/supabase'

// Get current user's posts
const { data: posts } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false })

// Create a new post
const { data: newPost } = await supabase
  .from('posts')
  .insert({
    title: 'My First Post',
    content: 'Hello, world!',
    user_id: supabaseUser.id
  })
```

## 🎯 Next Steps

After setup, you can:
- Add more database tables
- Implement real-time subscriptions
- Add file storage with Supabase Storage
- Create API endpoints with Supabase Edge Functions
- Build complex relationships between data

## 🆘 Troubleshooting

**Error: "Failed to sync user with Supabase"**
- Check your Supabase URL and key
- Verify the database schema is set up correctly
- Check browser console for detailed error messages

**RLS Policies Not Working**
- Ensure you're using the correct Auth0 JWT format
- Verify the policies are enabled on your tables
- Check that the `auth0_id` matches between Auth0 and Supabase
