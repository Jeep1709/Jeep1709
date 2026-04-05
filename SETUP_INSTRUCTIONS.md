# JEEP Pharmacy - Inventory Management System

## Setup Instructions

This is a professional pharmacy drug inventory management system built with Next.js, Supabase, and modern web technologies.

### Features

- **User Authentication**: Secure login and registration with email/password
- **Drug Inventory Management**: Add, edit, delete, and track drugs
- **Alphabetical Sorting**: Drugs are automatically sorted by name
- **Search Functionality**: Quickly find drugs by name
- **QR Code Scanning**: Scan drug QR codes to add/update inventory
- **Dashboard Analytics**: View total drugs and total inventory value
- **Multi-Device Access**: Access your inventory from any device
- **Cloud Sync**: All data automatically syncs across devices

### Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18+ installed

### Step-by-Step Setup

#### 1. Database Setup in Supabase

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Create a new query and copy-paste the following SQL:

```sql
-- Create drugs table for pharmacy inventory
create table if not exists public.drugs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  quantity integer not null default 0,
  price numeric(10, 2) not null default 0,
  qr_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.drugs enable row level security;

-- Create RLS policies
create policy "Users can view their own drugs" on public.drugs
  for select using (auth.uid() = user_id);

create policy "Users can insert their own drugs" on public.drugs
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own drugs" on public.drugs
  for update using (auth.uid() = user_id);

create policy "Users can delete their own drugs" on public.drugs
  for delete using (auth.uid() = user_id);

-- Create index on user_id for faster queries
create index if not exists idx_drugs_user_id on public.drugs(user_id);
```

4. Click **Execute** to run the query
5. You should see "Committed" at the bottom

#### 2. Environment Variables

The Supabase integration should automatically provide these variables in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_URL`

If not, manually add them in the Vercel dashboard under Settings → Vars.

#### 3. Running the Application Locally

```bash
# Install dependencies (automatic in Vercel)
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000 in your browser
```

#### 4. First Time Setup

1. Visit http://localhost:3000
2. Click **"Get Started - Sign Up"**
3. Create an account with your email and password
4. Verify your email (check spam folder if needed)
5. You'll be redirected to the dashboard
6. Start adding drugs to your inventory!

### How to Use

#### Adding a Drug
1. Click the **"+ Add Drug"** button
2. Enter:
   - Drug name (e.g., "Paracetamol")
   - Quantity in stock
   - Price per unit
   - QR code (optional)
3. Click **"Add Drug"**

#### Scanning QR Codes
1. Click the **"📱 Scan QR"** button
2. Allow camera access when prompted
3. Point camera at drug QR code
4. Or paste/type QR code data manually
5. The form will open with QR code pre-filled

#### Editing a Drug
1. Click **"Edit"** on any drug card
2. Update the information
3. Click **"Update Drug"**

#### Deleting a Drug
1. Click **"Delete"** on any drug card
2. Confirm deletion
3. Drug is removed from inventory

#### Searching Drugs
1. Use the search bar to filter drugs by name
2. Results update in real-time as you type

#### Viewing Statistics
- Dashboard shows:
  - Total number of drugs in inventory
  - Total inventory value (sum of all drugs × quantities)

### Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"New Project"** and select your GitHub repository
4. Environment variables should auto-populate from Supabase integration
5. Click **"Deploy"**
6. Share your production URL!

### Troubleshooting

#### "Unauthorized" error when loading drugs
- Make sure you're logged in
- Check that your email is verified
- Go to Supabase dashboard → SQL Editor and verify the RLS policies are created

#### QR Scanner not working
- Check browser camera permissions
- Some browsers require HTTPS (localhost is OK)
- Manual QR code input should always work

#### Drugs not saving
- Check browser console for errors (F12 → Console)
- Verify Supabase environment variables are set
- Ensure your email is verified in Supabase

#### Can't login
- Check that your password is correct
- Use email verification link from your email
- Reset password using "Forgot password" option (if available)

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Data Fetching**: SWR
- **Deployment**: Vercel

### Features for Future Enhancement

- Expiry date tracking
- Sales history and reports
- Barcode scanning
- Multi-user roles (admin, pharmacist, viewer)
- Cloud backup and export
- Inventory alerts and notifications
- Drug batch/lot tracking
- Supplier management

### Support

For issues or questions:
1. Check Supabase status at [status.supabase.com](https://status.supabase.com)
2. Review browser console errors (F12 → Console)
3. Check Supabase logs in your project dashboard
4. Visit [vercel.com/help](https://vercel.com/help) for deployment issues

---

**Made with ❤️ for pharmacy management**
