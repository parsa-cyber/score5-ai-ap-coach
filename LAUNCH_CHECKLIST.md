# Score5 Launch Checklist

## Local testing

- [ ] Run `npm install`.
- [ ] Add `.env.local` with `OPENAI_API_KEY`.
- [ ] Run `npm run dev`.
- [ ] Test `/courses` and select multiple AP classes.
- [ ] Test `/tutor` with at least 3 different AP courses.
- [ ] Test `/frq` with one STEM course and one writing-heavy course.
- [ ] Test `/screenshots` upload, screen capture, camera capture, and open-palm gesture capture.
- [ ] Test `/reviews` and replace review text with exact testimonials.

## Content

- [ ] Replace demo/starter questions with reviewed original AP-style banks.
- [ ] Add at least 100 questions for first target course.
- [ ] Add at least 20 FRQ prompts and rubrics for first target course.
- [ ] Add course-specific review sheets for your highest-demand AP classes.

## Deployment

- [ ] Push to GitHub.
- [ ] Import repo into Vercel.
- [ ] Add environment variables in Vercel.
- [ ] Redeploy.
- [ ] Test live API routes.

## Marketing

- [ ] Record a demo of gesture screenshot capture.
- [ ] Record a demo of FRQ grading.
- [ ] Start with school/student testers.
- [ ] Collect real quotes and permission before using names publicly.

## Account launch checklist

- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to `.env.local`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- [ ] Run `supabase/schema.sql` in Supabase SQL Editor
- [ ] Configure Supabase Auth redirect URLs for localhost and production
- [ ] Edit the Supabase email template to include `{{ .Token }}` for 6-digit OTP codes
- [ ] Enable Google provider in Supabase Auth Providers
- [ ] Test `/auth` email code login locally
- [ ] Test `/auth` Google login locally
- [ ] Add same Supabase variables to Vercel Environment Variables before production deployment
