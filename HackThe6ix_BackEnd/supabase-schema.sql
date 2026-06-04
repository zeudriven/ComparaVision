-- Supabase SQL Schema for Auth0 + Supabase Integration
-- Run this in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own data
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth0_id = auth.jwt() ->> 'sub');

-- Policy to allow users to update their own data
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth0_id = auth.jwt() ->> 'sub');

-- Policy to allow inserting new users (for first-time sync)
CREATE POLICY "Allow user creation" ON users
  FOR INSERT WITH CHECK (true);

-- Create an index on auth0_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth0_id ON users(auth0_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Example: Create a sample posts table to demonstrate user relationships
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy for posts - users can only see their own posts
CREATE POLICY "Users can view their own posts" ON posts
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE auth0_id = auth.jwt() ->> 'sub'
  ));

-- Policy for posts - users can create posts
CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM users WHERE auth0_id = auth.jwt() ->> 'sub'
  ));

-- Policy for posts - users can update their own posts
CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (user_id IN (
    SELECT id FROM users WHERE auth0_id = auth.jwt() ->> 'sub'
  ));

-- Policy for posts - users can delete their own posts
CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (user_id IN (
    SELECT id FROM users WHERE auth0_id = auth.jwt() ->> 'sub'
  ));
