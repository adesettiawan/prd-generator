# AI PRD Generator

Generate comprehensive Product Requirements Documents (PRDs) in minutes using AI.

## Tech Stack

- **Build:** Vite
- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS v4
- **State:** TanStack Query v5
- **Forms:** React Hook Form + Zod
- **AI:** Google Gemini API (gemini-1.5-flash)
- **Export:** jsPDF, react-markdown

## Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API key (free tier available)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd ai-prd-generator

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your API key to .env
VITE_GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run linter |

## Project Structure

```
src/
├── components/
│   ├── form/          # Form components
│   ├── editor/        # Markdown editor
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── services/          # API and utilities
├── types/             # TypeScript types
├── pages/             # Page components
└── layouts/           # Layout components
```

## Design Tokens

This project follows design tokens from `DESIGN.md`:

- **Font:** Open Sans, 14px base
- **Colors:** Semantic tokens (surface, text, border)
- **Spacing:** 4px increments
- **Border Radius:** xs to 2xl scale
- **Motion:** instant, fast, normal durations

## Features

- AI-powered PRD generation
- Real-time Markdown preview
- Auto-save to localStorage
- Export to PDF and Markdown
- Accessible (WCAG 2.2 AA)
- Keyboard-first navigation

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes |

## License

MIT
