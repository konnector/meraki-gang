# AI Spreadsheet Generator

A modern web application that generates structured spreadsheets from natural language descriptions using AI. Simply describe what kind of spreadsheet you need, and the AI will create it instantly.

## Features

- 🤖 AI-Powered Generation - Convert natural language to structured spreadsheets
- 📊 Instant Preview - See your generated spreadsheet immediately
- 💾 Multiple Export Options - Download as CSV or XLSX
- 📝 Formula Support - Includes Excel formulas when relevant
- 🎨 Clean, Modern UI - Simple and intuitive interface

## Project Structure

```
├── .next/                # Next.js build output
├── node_modules/         # Project dependencies
├── public/               # Static assets
├── src/                  # Source code
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API endpoints
│   │   │   └── generate/ # Spreadsheet generation API
│   │   │       └── route.ts    # API route for OpenAI integration
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout component
│   │   └── page.tsx      # Main application page
│   ├── components/       # Reusable React components
│   │   └── SpreadsheetPreview.tsx  # Component for rendering spreadsheet preview
│   └── lib/              # Utility functions and libraries
│       └── spreadsheetGenerator.ts  # Library for generating Excel spreadsheets
├── .env.local            # Environment variables (API keys)
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── pnpm-lock.yaml        # Package lock file for pnpm
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## File Descriptions

### Main Application Files

- **src/app/page.tsx**: The main application interface with the prompt input, example buttons, and spreadsheet display. Handles user interaction, API calls, and spreadsheet downloads.

- **src/app/api/generate/route.ts**: API endpoint that connects to OpenAI GPT-4 model to generate spreadsheet structures based on user prompts. Processes the AI response and returns structured data.

- **src/lib/spreadsheetGenerator.ts**: Utility module using ExcelJS to create downloadable XLSX files from the generated spreadsheet data, including headers and formulas.

- **src/components/SpreadsheetPreview.tsx**: Component for rendering tabular data preview using TanStack Table library, showing the generated spreadsheet in the UI before download.

### Configuration Files

- **.env.local**: Contains environment variables, including the OpenAI API key.
- **next.config.ts**: Configuration for the Next.js application.
- **tsconfig.json**: TypeScript configuration settings.
- **package.json**: Dependencies and scripts for the project.

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a description of the spreadsheet you need (e.g., "Create a monthly budget tracker with income and expenses")
2. Click the generate button
3. Preview the generated spreadsheet
4. Export to your preferred format (XLSX)

## Example Prompts

- "Create a monthly budget tracker with income, expenses, and savings categories"
- "Generate a project timeline with tasks, deadlines, and progress tracking"
- "Make an inventory management sheet with items, quantities, and reorder points"

## Tech Stack

- Next.js 14+ with App Router
- TypeScript
- OpenAI API (GPT-4)
- ExcelJS for XLSX generation
- TanStack Table for data display
- Tailwind CSS for styling

## License

MIT License - feel free to use this project for any purpose.

---

Built with ❤️ using Next.js and OpenAI
