# Score5 AI AP Coach

Score5 is a launchable Next.js AP study coach with diagnostics, AP-style practice, AI tutor, FRQ grading, screenshot analysis, gesture camera capture, Supabase Auth, Stripe Pro payments, and growth/revenue features.

## New growth/revenue features included

- Free vs Pro limits and upgrade prompts
- Predicted AP score diagnostic funnel
- FRQ grader positioned as the paid killer feature
- AP Exam Cram Mode (`/cram`)
- Referral rewards (`/referrals`)
- Shareable diagnostic results (`/share`)
- Mistake Notebook (`/mistakes`)
- Email reminder settings (`/reminders`)
- Teacher/classroom mode landing page (`/teacher`)
- Growth analytics checklist (`/analytics`)
- PWA install instructions (`/install`)
- Terms, Privacy, Refund, Contact pages
- Supabase schema additions for usage events, referrals, reminders, and paid subscriptions

## Local launch

```bash
cd score5-ai-ap-coach
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Required environment variables

```bash
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-5.1-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_secret_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_CRAM_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Never commit `.env.local`.

## Deployment flow

1. Run `npm run build` locally.
2. Push to GitHub.
3. Add environment variables in Vercel.
4. Redeploy.
5. Update Supabase auth redirect URLs.
6. Test Stripe checkout in sandbox before switching to live mode.

## Legal note

Score5 is not affiliated with, sponsored by, or endorsed by College Board. Review and customize the included legal templates before accepting live payments.
