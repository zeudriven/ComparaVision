# ModelCompare - YOLO & Vision Model Comparison Platform

Compare YOLO and computer vision models with side-by-side analysis, performance metrics, and carbon-aware analytics.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+
- npm 9+ (or yarn/pnpm)
- Git

### Setup Commands

```bash
# Clone and setup
git clone <your-repo-url>
cd hackthe6ix
npm install

# Create environment file (choose one):
# On macOS/Linux:
cp .env.example .env.local
# On Windows:
copy .env.example .env.local
# Or manually copy .env.example to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Copy `.env.example` to `.env.local` and update with your values:

```bash
# Copy the template
cp .env.example .env.local

# Edit with your actual values
nano .env.local
# or
code .env.local
```

### Development Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run linting
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js pages
├── components/            # React components
└── hooks/                # Custom hooks
```

## 🔒 Security

- Never commit API keys to version control
- `.env.local` is already in `.gitignore`
- Use different keys for development and production

## 📚 Documentation

- [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md) - Backend setup
- [REAL_TIME_INTEGRATION.md](REAL_TIME_INTEGRATION.md) - Real-time features
