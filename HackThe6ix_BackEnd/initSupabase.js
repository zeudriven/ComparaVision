require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

async function initSupabase() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .limit(1);
      
    if (error) throw error;
    console.log('Successfully connected to Supabase!');
    console.log('Test query result:', data);
  } catch (error) {
    console.error('Failed to connect:', error.message);
    process.exit(1);
  }
}

initSupabase();
