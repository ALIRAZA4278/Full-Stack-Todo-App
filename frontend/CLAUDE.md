# Frontend Agent Instructions

This is the Next.js frontend for the Hackathon Todo Phase II application.

## Technology Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth
- **State**: React hooks (useState, useEffect)

## Project Structure

```
frontend/
├── app/                     # App Router pages
│   ├── (auth)/             # Public auth routes (signin, signup)
│   ├── (app)/              # Protected routes (tasks)
│   ├── api/auth/           # Better Auth API routes
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── loading.tsx         # Global loading
│   ├── error.tsx           # Global error boundary
│   └── not-found.tsx       # 404 page
├── components/
│   ├── ui/                 # Generic UI components
│   └── todo/               # Domain-specific components
├── lib/
│   ├── auth.ts             # Better Auth configuration
│   └── api.ts              # API client with JWT attachment
└── package.json
```

## Key Rules

1. **Client Components**: All interactive components must use 'use client' directive
2. **JWT Attachment**: All API calls must include JWT token from Better Auth session
3. **User Isolation**: Never allow access to other users' data
4. **Error Handling**: Show user-friendly error messages via toast notifications
5. **Loading States**: Always show loading indicators during async operations
6. **Form Validation**: Validate on client before submission

## Design System

- Primary: blue-600 / blue-700 (hover)
- Font: Inter (sans-serif)
- Spacing: Tailwind's default 4px scale
- Border Radius: rounded-md for buttons, rounded-lg for cards
- Shadows: shadow-sm for cards, shadow-lg for modals

## API Integration

All API calls go through `lib/api.ts` which:
1. Gets JWT token from Better Auth session
2. Attaches token to Authorization header
3. Handles errors and returns typed responses

## Environment Variables

Required in `.env.local`:
- `BETTER_AUTH_SECRET` - JWT signing secret (must match backend)
- `BETTER_AUTH_URL` - This frontend's URL
- `NEXT_PUBLIC_API_URL` - Backend API URL
