# AI Spreadsheet Generator

A modern web application that generates structured spreadsheets from natural language descriptions using AI. Simply describe what kind of spreadsheet you need, and the AI will create it instantly.

## Features

- 🤖 AI-Powered Generation - Convert natural language to structured spreadsheets
- 📊 Instant Preview - See your generated spreadsheet immediately
- 💾 Multiple Export Options - Download as CSV or XLSX
- 📝 Formula Support - Includes Excel formulas when relevant
- 🎨 Clean, Modern UI - Simple and intuitive interface

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
4. Export to your preferred format (CSV or XLSX)

## Example Prompts

- "Create a monthly budget tracker with income, expenses, and savings categories"
- "Generate a project timeline with tasks, deadlines, and progress tracking"
- "Make an inventory management sheet with items, quantities, and reorder points"

## Tech Stack

- Next.js 14
- TypeScript
- OpenAI API
- XLSX.js
- TanStack Table
- Tailwind CSS

## License

MIT License - feel free to use this project for any purpose.

---

Built with ❤️ using Next.js and OpenAI
