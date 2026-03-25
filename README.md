# VisionTrack | Weighbridge Dashboard

A full-stack Next.js application that provides a secure, immutable logging system for vehicle plates and load weights, using Supabase for PostgreSQL and Image Storage.

## Features

- **Dashboard View**: View logs of all checked vehicles.
- **Data Entry**: Secure form to upload 2 images, truck number, weight, and person name.
- **Immutable Data**: Entries cannot be edited or deleted once submitted, ensuring integrity.
- **Filtering & Auto-Pagination**: Find records efficiently.
- **Real-time Image Preview**: Preview upload images before saving.
- **Beautiful UI**: Modern, clean design matching specific color patterns.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Storage:** Supabase Storage
- **Styling:** Vanilla CSS/Tailwind + FontAwesome

---

## Setup Instructions

### 1. Supabase Project Setup
1. Create a new project on [Supabase.com](https://supabase.com).
2. Go to **Storage** and create a public bucket named `truck-images`.
3. In your bucket settings, ensure policies allow "INSERT" operations if using Anon keys or configure it appropriately.
4. Go to **Settings > API** to find your *Project URL* and *anon public key*.
5. Go to **Settings > Database** to find your *Connection string* (Transaction and Session Mode).

### 2. Environment Variables
Create a `.env` file in the root of the application with the following:
```env
DATABASE_URL="postgres://postgres.xxx:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.xxx:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
```

### 3. Initialize Prisma & Database
Run these commands to generate your local Prisma client and push the schema to Supabase.
```bash
npm install
npx prisma generate
npx prisma db push
```

### 4. Running Locally
Start the local development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

---
## Project Structure
- `app/api/entries/route.ts`: API endpoints for `GET` & `POST` entries.
- `app/page.tsx` & `layout.tsx`: Main Pages holding the Layout.
- `components/`: Client-side React components representing UI pieces.
- `lib/`: Helper singletons for Prisma and Supabase.
- `prisma/schema.prisma`: The central database schema for Prisma.
