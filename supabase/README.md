# Supabase Configuration

This directory contains the Supabase configuration file that controls various settings for your Supabase project, including **disabling email confirmations**.

## Key Setting: Email Confirmations Disabled

The most important setting in `config.toml` is:

```toml
[auth.email]
enable_confirmations = false
```

This disables the requirement for users to confirm their email addresses before they can sign in. Instead, they'll receive your custom Mailtrap welcome email.

## How to Apply This Configuration

### Option 1: For Self-Hosted Supabase

If you're running Supabase locally or self-hosted:

1. Ensure you have the Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project (if not already done):
   ```bash
   supabase init
   ```

3. Copy this `config.toml` to your `supabase` directory (already done)

4. Start Supabase with the new config:
   ```bash
   supabase start
   ```

### Option 2: For Supabase Cloud (Managed Service)

Unfortunately, Supabase Cloud removed the dashboard toggle for email confirmations. Here are your options:

#### A. Use Supabase CLI to Link and Push Config

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link to your cloud project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Push config to cloud (note: some settings may not be configurable on cloud):
   ```bash
   supabase db push
   ```

#### B. Contact Supabase Support

Since the dashboard option is removed and not all config.toml settings work with cloud instances, you may need to:

1. Open a support ticket at [https://supabase.com/dashboard/support](https://supabase.com/dashboard/support)
2. Request them to disable email confirmations for your project
3. Reference the `auth.email.enable_confirmations = false` setting

#### C. Workaround: Auto-Verify Users Programmatically

If you can't disable confirmations, you can auto-verify users after signup using the Admin API:

```python
# In your backend (backend/utils/auth_helpers.py)
from supabase import create_client
import os

# Use service role key (has admin privileges)
supabase_admin = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # NOT the anon key!
)

async def auto_verify_user(user_id: str):
    """Auto-verify a user's email after signup"""
    try:
        supabase_admin.auth.admin.update_user_by_id(
            user_id,
            {"email_confirmed_at": datetime.utcnow().isoformat()}
        )
    except Exception as e:
        print(f"Failed to auto-verify user: {e}")
```

Then call this after user signup in your registration flow.

#### D. Use Magic Link Instead

Another option is to use Supabase's magic link feature:

```toml
[auth.email]
enable_magic_link = true
```

This sends a one-click login link instead of requiring email confirmation.

## Environment Variables

Make sure you have these environment variables set:

```env
# Backend (.env)
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # For admin operations

# Frontend (.env)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Configuration Options Explained

### Auth Settings

- `enable_signup`: Allow new user registrations
- `enable_confirmations`: Require email confirmation (set to `false`)
- `double_confirm_changes`: Require confirmation when changing email/password
- `jwt_expiry`: How long auth tokens last (in seconds)

### Site URLs

- `site_url`: Your main website URL (used for email redirects)
- `additional_redirect_urls`: Other allowed redirect URLs after authentication

### External Providers

Configure OAuth providers like Google:

```toml
[auth.external.google]
enabled = true
client_id = "your-google-client-id"
secret = "your-google-client-secret"
```

## Recommended Approach

Given that Supabase Cloud has limitations, I recommend:

1. **Start with Option B (Contact Support)** - They can disable confirmations server-side
2. **Fallback to Option C (Auto-Verify)** - Implement programmatic verification if support can't help
3. **Keep this config.toml** - For documentation and if you ever migrate to self-hosted

## Testing

To verify email confirmations are disabled:

1. Create a new test user via email/password signup
2. User should be immediately able to sign in without checking email
3. They'll still receive your Mailtrap welcome email (which is good!)

## Need Help?

- Supabase CLI Docs: https://supabase.com/docs/guides/cli
- Supabase Config Reference: https://supabase.com/docs/guides/cli/config
- Auth Settings: https://supabase.com/docs/guides/auth/auth-email
