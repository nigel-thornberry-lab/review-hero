# Review Hero

> Get more reviews. Stop bad ones. Collect referrals.

A universal review collection and referral generation tool for the WHOP marketplace.

## Features

- **Smart Review Routing**: 4-5 star reviews go to Google, 1-3 star reviews stay private
- **Negative Review Interception**: Fix issues before they become public problems
- **Referral Collection**: Turn happy customers into warm leads
- **Industry Templates**: 20+ pre-built templates for different business types
- **Automated Nudges**: Smart follow-ups increase completion rates
- **Embeddable Widget**: Display reviews on your website

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Neon (Serverless Postgres) + Drizzle ORM
- **Auth**: WHOP OAuth
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- Neon database account
- WHOP developer account

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/review-hero.git
cd review-hero

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your credentials

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

See `.env.local.example` for required environment variables.

## Project Structure

```
review-hero/
├── app/                    # Next.js app router pages
├── components/             # React components
├── lib/
│   ├── db/                # Database schema and client
│   ├── whop/              # WHOP integration
│   ├── security/          # Rate limiting, validation
│   └── templates/         # Industry templates
└── public/                # Static assets
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## License

MIT
