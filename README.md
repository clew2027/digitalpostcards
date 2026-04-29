# Digital Postcards

A React + TypeScript app for creating and sharing animated digital postcards with friends via shared groups.

## Features

- **Postcard Editor** — 8 templates, live preview, stickers, font picker, 5 animations
- **Groups** — Create groups with shareable invite codes, send postcards to a shared feed
- **Preview Page** — Shareable link per postcard with envelope reveal animation
- **Persistence** — State saved

## how to start the project 
```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project Structure

```
src/
├── components/
│   ├── PostcardCanvas.tsx      # Renders the postcard visual
│   ├── Toolbar.tsx             # Editor controls (template/text/style/anim)
│   ├── HomePage.tsx            # Groups overview
│   ├── PostcardEditor.tsx      # Create/edit page
│   ├── GroupPage.tsx           # Shared group feed
│   ├── PreviewPage.tsx         # Shareable postcard view
│   ├── SendModal.tsx           # Group picker modal
│   └── Toast.tsx               # Notification toasts
├── data/
│   └── constants.ts            # Templates, stickers, fonts, sample data
├── hooks/
│   └── useGroups.ts            # Group + postcard state (localStorage)
├── types.ts                    # Shared TypeScript types
├── App.tsx                     # Root + routing
└── main.tsx                    # Entry point
```

## Backend Supabase

```sql
-- Users (handled by Supabase Auth)

create table groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  created_at timestamptz default now()
);

create table group_members (
  group_id uuid references groups(id),
  user_id uuid references auth.users(id),
  primary key (group_id, user_id)
);

create table postcards (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id),
  from_name text,
  location text,
  message text,
  template text,
  stickers text[],
  font text,
  anim text,
  created_at timestamptz default now()
);
```# digitalpostcards
