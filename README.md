# Score5 — AI AP Study Coach

Score5 is a launchable MVP for an AI AP Study Coach that now supports every AP subject listed in the app's course library. It includes a landing page, all-course onboarding, diagnostic quiz, dashboard, practice engine, mistake review, AI tutor, FRQ grader, screenshot/image coach, phone-camera capture, open-palm hand-gesture capture, progress analytics, reviews page, pricing page, Stripe Checkout endpoint, Supabase schema, and OpenAI-powered API routes with local fallbacks.

## New in this version

- Course library for 42 AP subjects
- Course selector across onboarding, practice, AI Tutor, FRQ Grader, Progress, and Screenshot Coach
- Generic AP-style starter practice for every AP class
- Built-in original starter bank for AP Physics 1
- Open-palm camera gesture capture with a 3-second countdown
- Reviews page with five-star early tester cards
- Fixed package setup for Mac/Apple Silicon by not forcing a Linux-only Next SWC package
- Removed the generated package lock from the zip so npm installs platform-correct packages

## Run locally

```bash
cd ~/Downloads/score5-ai-ap-coach
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Only OpenAI is needed for the AI features:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.1-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Supabase and Stripe can be added later when you want real login, database persistence, and payments.

## Important launch note on reviews

The app includes review cards for Jake, Calvin, Amir, and Ali based on the names provided during development. Replace the text with the exact review wording you have from them before publicly marketing the site.

## Pages

- `/` landing page
- `/courses` full AP course library
- `/onboarding` course/profile setup
- `/diagnostic` diagnostic quiz
- `/dashboard` personalized dashboard
- `/practice` practice modes
- `/tutor` AI tutor
- `/frq` FRQ/written response grader
- `/screenshots` screenshot + camera + hand gesture capture
- `/reviews` reviews page
- `/progress` analytics
- `/pricing` pricing page

## Open-palm gesture capture

The screenshot page can use the phone/laptop camera. Click **Start phone camera**, then **Open-palm gesture**. Showing an open palm with 4-5 extended fingers starts a 3-second countdown and captures the camera frame.

The gesture model loads MediaPipe Hands from a CDN, so it requires internet access in the browser. If the model cannot load, the normal camera capture button still works.

## Production checklist

1. Replace placeholder review copy with exact submitted testimonials.
2. Add more reviewed question banks per AP course.
3. Add Supabase auth + database persistence.
4. Add Stripe products and price IDs.
5. Deploy to Vercel and add environment variables in the Vercel dashboard.
6. Test screenshot/camera permissions on iPhone Safari and Chrome.

## Real Accounts: Email Verification Codes + Google Sign-In

This version includes a production-ready auth screen at `/auth` and an account page at `/account`.

### What works after Supabase is configured

- Email sign-up/sign-in with a 6-digit verification code
- Google sign-in/sign-up
- Persistent browser sessions
- Account page with signed-in user info
- Sign out
- Profile row creation trigger in `supabase/schema.sql`

### Required environment variables

Add these to `.env.local` locally and to Vercel Environment Variables in production:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Keep your OpenAI variables too:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.1-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Supabase setup checklist

1. Create a Supabase project.
2. Copy the Project URL and anon/public key into `.env.local`.
3. In Supabase SQL Editor, run `supabase/schema.sql`.
4. In Supabase Auth URL Configuration, add:
   - `http://localhost:3000`
   - `http://localhost:3000/auth/callback`
   - your Vercel production domain later
5. For 6-digit email codes, edit the Supabase email template so it includes `{{ .Token }}`. If the template uses `{{ .ConfirmationURL }}`, users receive a magic link instead of a code.
6. For Google sign-in, enable Google in Supabase Auth Providers and add your Google OAuth client ID/secret.

The app will still run without Supabase, but `/auth` will show a setup warning until those public Supabase keys are present.
