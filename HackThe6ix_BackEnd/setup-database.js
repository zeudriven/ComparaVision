require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Setting up database tables...');
  
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (usersError && !usersError.message.includes('already exists')) {
      console.error('Error creating users table:', usersError);
    } else {
      console.log('✅ Users table ready');
    }

    // Test the connection
    const { data, error } = await supabase.from('users').select('count');
    if (error) throw error;
    
    console.log('✅ Database setup complete!');
    console.log('✅ Connection test successful');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n📋 Manual setup required:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
    console.log('2. Open the SQL Editor');
    console.log('3. Run the contents of supabase-schema.sql');
    process.exit(1);
  }
}

setupDatabase();
