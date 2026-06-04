# Supabase Connection Guide

1. Install Supabase client:
```bash
npm install @supabase/supabase-js
```

2. Add these environment variables to your .env file:
```properties
REACT_APP_SUPABASE_URL=https://xoodnuckjmlmejeyyneg.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Initialize Supabase client:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
)
```

4. Test connection:
```javascript
const { data, error } = await supabase
  .from('public_models')
  .select('*')
  .limit(1)
```

Note: Keep these credentials secure and never commit them to version control.
