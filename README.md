# Career Roadmap Planner

A premium, interactive Gantt-style career planning platform that transforms whiteboard roadmaps into a stakeholder-ready SaaS experience.

![Career Roadmap Planner](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)

## Features

- **Custom Gantt Chart Engine** — Built from scratch with drag, resize, zoom, and lane switching
- **Swim Lanes** — Add, rename, reorder, collapse, color-code, and delete lanes
- **Tasks** — Full task system with colors, tags, status, priority, and rich notes
- **Milestones** — Diamond markers on timeline, draggable and editable
- **TipTap Notes** — Rich text editor with checklists, links, and markdown support
- **Lock Mode** — View-only roadmap with confirmation to unlock
- **Presentation Mode** — Fullscreen stakeholder view with keyboard navigation
- **Dashboard** — Active roadmap, progress, milestones, activity feed
- **Templates** — 5 starter career roadmap templates
- **Mobile Experience** — Card-based view with timeline toggle
- **Version Snapshots** — Save and restore roadmap versions
- **Claymorphism Design** — Premium soft UI with Motion animations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| State | Zustand (persisted to localStorage) |
| Database | Prisma + PostgreSQL |
| Animations | Motion |
| Editor | TipTap |
| Deployment | Vercel |

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables (optional — app works without DB)
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app ships with sample PM career roadmap data pre-loaded.

### Database Setup (Optional)

```bash
# Configure DATABASE_URL in .env
npm run db:push
npm run db:seed
```

## Folder Structure

```
src/
├── app/
│   ├── page.tsx                    # Dashboard homepage
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Clay design tokens + Tailwind v4
│   ├── roadmap/[id]/page.tsx       # Roadmap editor view
│   └── api/roadmaps/               # REST API routes
├── components/
│   ├── dashboard/                  # Dashboard widgets
│   ├── gantt/                      # Custom Gantt chart engine
│   │   ├── gantt-chart.tsx         # Main chart container + drag logic
│   │   ├── gantt-task-bar.tsx      # Task bar with resize handles
│   │   ├── gantt-swim-lane-row.tsx # Lane rows with sticky labels
│   │   ├── gantt-timeline-header.tsx
│   │   ├── gantt-milestone.tsx
│   │   ├── gantt-toolbar.tsx
│   │   └── timeline-settings.tsx
│   ├── roadmap/                    # Task panel, presentation, mobile
│   ├── editor/                     # TipTap rich text editor
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── stores/roadmap-store.ts     # Zustand store (persisted)
│   ├── templates.ts                # Starter templates + sample data
│   ├── timeline.ts                 # Timeline math + column builder
│   ├── prisma.ts                   # Prisma client singleton
│   └── utils.ts
└── types/
    └── roadmap.ts                  # TypeScript interfaces
prisma/
├── schema.prisma                   # Database models
└── seed.ts                         # Seed script
```

## Architecture

### Gantt Rendering Engine

The custom Gantt engine (`src/lib/timeline.ts` + `src/components/gantt/`) calculates timeline columns dynamically based on zoom level (year/quarter/month/week). Task positions are computed as pixel offsets from date ranges — no third-party Gantt library.

```
Timeline Start/End → buildTimelineColumns() → Column widths
Task dates → getTaskPosition() → { left, width } pixels
Pointer events → pixelToDate() → Updated task dates
```

### Drag-and-Drop Architecture

Drag state is managed in `GanttChart` via pointer events:

- **Move** — Shifts start/end dates by day delta
- **Resize Start/End** — Adjusts one boundary
- **Lane Switch** — Detects hover target lane during drag
- **Milestone Drag** — Maps X position to date on timeline

All mutations flow through Zustand store actions with activity logging.

### Zustand Store Design

Single `useRoadmapStore` with persist middleware:

- **Roadmaps[]** — All user roadmaps
- **Versions[]** — Snapshot history
- **UI State** — presentationMode, selectedTaskId, mobileTimelineView
- **Actions** — CRUD for roadmaps, lanes, tasks, milestones

Client-side persistence ensures the MVP works without a database connection.

### Mobile Strategy

Below `768px`, the Gantt chart is replaced with a card-based lane view. Users can tap "Open Timeline View" for full Gantt access on larger screens or landscape orientation.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Navigate timeline (Presentation Mode) |
| `Esc` | Exit Presentation Mode |

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set `DATABASE_URL` environment variable for PostgreSQL persistence. Without it, the app uses client-side localStorage.

## Templates

1. Project Management Career Roadmap (default, whiteboard-inspired)
2. Software Engineering Roadmap
3. Data Science Roadmap
4. Product Management Roadmap
5. Graduate Career Planning

## License

MIT
