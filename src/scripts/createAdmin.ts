import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !serviceRoleKey || !adminEmail || !adminPassword) {
  console.error('Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL or ADMIN_PASSWORD');
  process.exit(1);
}

if (adminPassword.length < 12) {
  console.error('ADMIN_PASSWORD must contain at least 12 characters');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createAdminUser() {
  try {
    const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (listError) throw listError;

    const existingUser = usersPage.users.find(user => user.email?.toLowerCase() === adminEmail);
    const attributes = {
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      app_metadata: {
        ...(existingUser?.app_metadata || {}),
        role: 'admin',
      },
    };

    const { error } = existingUser
      ? await supabase.auth.admin.updateUserById(existingUser.id, attributes)
      : await supabase.auth.admin.createUser(attributes);

    if (error) {
      console.error('Error creating admin user:', error.message);
      process.exit(1);
    }

    console.log(existingUser ? 'Admin user updated successfully' : 'Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

createAdminUser();
