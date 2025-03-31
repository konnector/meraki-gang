'use client';

import { useState } from 'react';

type SpreadsheetData = {
  result: string;
  success: boolean;
};

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(48);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    // Auto-resize textarea
    e.target.style.height = '48px';
    const scrollHeight = e.target.scrollHeight;
    e.target.style.height = `${Math.min(scrollHeight, 400)}px`; // Max height of 400px
    setTextareaHeight(Math.min(scrollHeight, 400));
  };

  const generateSpreadsheet = async () => {
    try {
      setLoading(true);
      setHasGenerated(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setSpreadsheetData(data);
    } catch (error) {
      console.error('Error generating spreadsheet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen flex flex-col items-center ${!hasGenerated ? 'justify-center' : 'pt-10'} p-3 bg-[#FCFCF9]`}>
      <div className={`w-full max-w-2xl mx-auto text-center space-y-6 ${hasGenerated ? 'mb-8' : ''}`}>
        <h1 className="text-3xl font-medium text-[#1a1a1a]">
          Generate Spreadsheets with AI
        </h1>
        <p className="text-gray-600 -mt-2">
          Describe the spreadsheet you need, and I&apos;ll create it instantly
        </p>
        
        <div className="bg-[#FCFCF9] w-full outline-none focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-300 font-sans flex items-center text-gray-900 placeholder-gray-500 border border-gray-200 shadow-sm shadow-gray-900/5 rounded-3xl px-4 pt-3 pb-3 grid items-center">
          <div className="grid grid-rows-[1fr,auto] grid-cols-3">
            <div className="col-start-1 col-end-4 pb-2 overflow-hidden relative flex h-full w-full">
              <textarea
                autoFocus
                value={prompt}
                onChange={handleTextareaChange}
                placeholder="Ask anything..."
                className="overflow-auto max-h-[45vh] lg:max-h-[4vh] sm:max-h-[25vh] outline-none w-full font-sans resize-none selection:bg-black-100 selection:text-gray-900 bg-[#FCFCF9] text-gray-900 placeholder-gray-500 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                rows={2}
                style={{ height: `${textareaHeight}px` }}
              />
            </div>
            <div className="bg-[#FCFCF9] gap-2 flex rounded-l-lg col-start-1 row-start-2 -ml-1">
              <div className="gap-2 flex">
                <div className="gap-2 flex items-center">
                  <button
                    type="button"
                    className="bg-gray-100 text-gray-900 hover:text-gray-600 border border-transparent px-2.5 font-sans outline-none transition duration-300 ease-out select-none items-center relative justify-center rounded-full cursor-pointer active:scale-[0.97] text-sm h-8 aspect-square"
                  >
                    <div className="flex items-center min-w-0 font-medium gap-1.5 justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="bg-gray-100 text-gray-900 hover:text-gray-600 border border-transparent font-sans outline-none transition duration-300 ease-out select-none items-center relative justify-center rounded-full cursor-pointer active:scale-[0.97] text-sm h-8 pl-2.5 pr-3"
                  >
                    <div className="flex items-center min-w-0 font-medium gap-1.5 justify-center">
                      <div className="flex shrink-0 items-center justify-center w-4 h-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 12v.01"/>
                          <path d="M19.071 4.929c-1.562 -1.562 -6 .337 -9.9 4.243c-3.905 3.905 -5.804 8.337 -4.242 9.9c1.562 1.561 6 -.338 9.9 -4.244c3.905 -3.905 5.804 -8.337 4.242 -9.9"/>
                          <path d="M4.929 4.929c-1.562 1.562 .337 6 4.243 9.9c3.905 3.905 8.337 5.804 9.9 4.242c1.561 -1.562 -.338 -6 -4.244 -9.9c-3.905 -3.905 -8.337 -5.804 -9.9 -4.242"/>
                        </svg>
                      </div>
                      <div className="text-align-center relative truncate leading-loose -mb-px">Deep Research</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[#FCFCF9] flex items-center justify-self-end rounded-full col-start-3 row-start-2 -mr-1">
              <div className="flex items-center">
                <button
                  type="button"
                  className="hover:bg-gray-100 text-gray-500 hover:text-gray-900 font-sans outline-none transition duration-300 ease-out select-none items-center relative justify-center rounded-full cursor-pointer active:scale-[0.97] text-sm h-8 aspect-square"
                >
                  <div className="flex items-center min-w-0 font-medium gap-1.5 justify-center">
                    <div className="flex shrink-0 items-center justify-center w-4 h-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"/>
                      </svg>
                    </div>
                  </div>
                </button>
                <div className="ml-2 flex gap-2">
                  <button
                    onClick={generateSpreadsheet}
                    disabled={loading || !prompt}
                    className={`${
                      !prompt || loading
                        ? 'bg-gray-200 text-gray-400 cursor-default'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } font-sans outline-none transition duration-300 ease-out select-none items-center relative justify-center rounded-full active:scale-[0.97] text-sm h-8 aspect-square`}
                  >
                    <div className="flex items-center min-w-0 font-medium gap-1.5 justify-center">
                      <div className="flex shrink-0 items-center justify-center w-4 h-4">
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"/>
                            <path d="M13 18l6 -6"/>
                            <path d="M13 6l6 6"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example prompts */}
        {!hasGenerated && (
          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-3">Try these examples:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => setPrompt("Create a monthly budget tracker with income, expenses, and savings categories")}
                className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Monthly Budget
              </button>
              <button 
                onClick={() => setPrompt("Generate a project timeline with tasks, deadlines, and progress tracking")}
                className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Project Timeline
              </button>
              <button 
                onClick={() => setPrompt("Make an inventory management sheet with items, quantities, and reorder points")}
                className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Inventory Tracker
              </button>
            </div>
          </div>
        )}

        {/* Spreadsheet Preview */}
        {hasGenerated && (
          <div className="mt-8 w-full bg-white rounded-xl border border-gray-200 p-4 min-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : spreadsheetData ? (
              <div className="text-left whitespace-pre-wrap text-gray-900 font-normal p-6 space-y-4">
                <div className="prose prose-gray max-w-none">
                  {spreadsheetData.result}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 flex items-center justify-center h-full">
                AI response will appear here
              </p>
            )}
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 w-full p-3 border-t bg-white">
        <nav className="max-w-6xl mx-auto flex items-center justify-center gap-5 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-900">Examples</a>
          <a href="#" className="hover:text-gray-900">API</a>
          <a href="#" className="hover:text-gray-900">Pricing</a>
          <a href="#" className="hover:text-gray-900">Documentation</a>
          <a href="#" className="hover:text-gray-900">Blog</a>
        </nav>
      </footer>
    </main>
  );
}
