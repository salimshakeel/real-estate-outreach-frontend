# Real Estate Outreach - Frontend

A Next.js frontend for the Real Estate Outreach Automation System.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

## Backend Connection

The frontend expects the backend API at `http://localhost:8000`.

Make sure your backend is running:
```bash
cd ../backend
uvicorn main:app --reload --port 8000
```

### CORS Configuration

Your backend needs CORS enabled. Add this to `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/` | Stats, funnel chart, activity feed |
| Leads | `/leads` | Lead list, CSV upload, filtering |
| Campaigns | `/campaigns` | Create, start, pause campaigns |
| Templates | `/templates` | Email template management |
| Demo | `/demo` | Simulate events for demos |

## Demo Mode

The `/demo` page lets you simulate events without real SendGrid/Calendly:

1. Upload leads via CSV
2. Create and start a campaign
3. Use Demo page to simulate:
   - Email opens
   - Replies (interested / not now)
   - Bookings
4. Watch Dashboard update

### Backend Demo Endpoints Needed

Add these endpoints to your backend for demo simulation:

```python
# POST /api/demo/simulate/open
# POST /api/demo/simulate/reply
# POST /api/demo/simulate/booking
# POST /api/demo/reset
```

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx           # Dashboard
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Tailwind styles
│   ├── leads/page.tsx     # Leads management
│   ├── campaigns/page.tsx # Campaign management
│   ├── templates/page.tsx # Template management
│   └── demo/page.tsx      # Demo controls
├── components/
│   ├── Sidebar.tsx        # Navigation
│   ├── StatCard.tsx       # Metric cards
│   ├── FunnelChart.tsx    # Lead funnel
│   └── ActivityFeed.tsx   # Recent activity
├── lib/
│   └── api.ts             # API client
└── package.json
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons
- Recharts (for future charts)
