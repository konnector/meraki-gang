'use client';

import { useState, useEffect } from 'react';
import { generateSpreadsheet } from '@/lib/spreadsheetGenerator';

type SpreadsheetData = {
  result: string;
  structure: {
    headers: string[];
    formulas: { cell: string; formula: string; }[];
  };
  success: boolean;
};

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(48);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    
    // Improved auto-resize logic
    const textarea = e.target;
    textarea.style.height = 'auto'; // Reset height first
    const newHeight = Math.max(48, textarea.scrollHeight); // Minimum height is 48px
    const maxHeight = 400; // Max height of 400px
    
    textarea.style.height = `${Math.min(newHeight, maxHeight)}px`;
    setTextareaHeight(Math.min(newHeight, maxHeight));
  };

  useEffect(() => {
    const dragTimeout: NodeJS.Timeout | undefined = undefined;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (dragTimeout) clearTimeout(dragTimeout);
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Only hide if we're leaving the window
      if (e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY <= 0 || e.clientY >= window.innerHeight) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (dragTimeout) clearTimeout(dragTimeout);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0) {
        const file = files[0];
        if (file.type === 'text/csv') {
          setCsvFile(file);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDragging(false);
      }
    };

    const cleanup = () => {
      setIsDragging(false);
      if (dragTimeout) clearTimeout(dragTimeout);
    };

    // Add document-level event listeners
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', cleanup);

    // Cleanup
    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', cleanup);
      if (dragTimeout) clearTimeout(dragTimeout);
    };
  }, []); // Remove dependencies since we're not using any external values

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    if (csvFile) {
      setCsvFile(csvFile);
    }
  };

  const generateSpreadsheetFile = async () => {
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

  const handleDownload = async () => {
    if (!spreadsheetData?.structure) return;

    try {
      const buffer = await generateSpreadsheet(
        spreadsheetData.structure.headers,
        spreadsheetData.structure.formulas
      );

      // Create blob and trigger download
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-spreadsheet.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading spreadsheet:', error);
    }
  };

  return (
    <main className={`min-h-screen flex flex-col items-center ${!hasGenerated ? 'justify-center' : 'pt-10'} p-3 bg-[#FCFCF9]`}>
      {/* Drag Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-50 flex items-center justify-center transition-all duration-300 ${
          isDragging ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className={`bg-white rounded-2xl p-8 flex flex-col items-center gap-4 w-[600px] h-[200px] mx-auto transition-all duration-300 transform border-2 border-dashed border-gray-200 ${
            isDragging ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-[15px] font-medium text-gray-900">Drop your files here</h3>
              <p className="text-sm text-gray-500 mt-1">Drop your files here to add them to your conversation</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`w-full max-w-2xl mx-auto text-center space-y-6 ${hasGenerated ? 'mb-8' : ''}`}>
        <h1 className="text-3xl font-normal text-[#1a1a1a]">
          What spreadsheet do you want to create?
        </h1>
        <p className="text-gray-600 -mt-2">
          Describe the spreadsheet you need, and I&apos;ll create it instantly
        </p>
        
        <div 
          className="bg-[#FCFCF9] w-full outline-none focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-300 font-sans flex flex-col text-gray-900 placeholder-gray-500 border border-gray-300 shadow-sm shadow-gray-900/5 rounded-3xl px-4 pt-3 pb-3"
        >
          {/* Attachments Section */}
          {csvFile && (
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex flex-row items-center rounded-xl px-3 h-8 bg-gray-100 text-sm transition ease-in-out cursor-pointer hover:bg-gray-200 text-gray-900 justify-between pr-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="!size-4 mr-2 shrink-0">
                  <path d="M12 3v18"/>
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <path d="M3 9h18"/>
                  <path d="M3 15h18"/>
                </svg>
                <span className="truncate max-w-[150px]">{csvFile.name}</span>
                <button
                  onClick={() => setCsvFile(null)}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:-mx-0.5 text-gray-900 hover:bg-gray-300 h-6 w-6 rounded-full ml-1 p-0.5"
                  type="button"
                  aria-label="Remove"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-rows-[1fr,auto] grid-cols-3">
            <div className="col-start-1 col-end-4 pb-2 overflow-hidden relative flex h-full w-full">
              <textarea
                autoFocus
                value={prompt}
                onChange={handleTextareaChange}
                placeholder="Ask anything..."
                className="overflow-auto outline-none w-full font-sans resize-none selection:bg-blue-100 selection:text-blue-900 bg-[#FCFCF9] text-gray-900 placeholder-gray-500 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                rows={1}
                style={{ height: `${textareaHeight}px`, minHeight: '48px', maxHeight: '400px', overflow: textareaHeight >= 400 ? 'auto' : 'hidden' }}
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
                <label className="hover:bg-gray-100 text-gray-500 hover:text-gray-900 font-sans outline-none transition duration-300 ease-out select-none flex items-center justify-center rounded-full cursor-pointer active:scale-[0.97] text-sm h-8 w-8">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"/>
                  </svg>
                </label>
                <div className="ml-2 flex gap-2">
                  <button
                    onClick={generateSpreadsheetFile}
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
              <div className="space-y-4">
                <div className="text-left whitespace-pre-wrap text-gray-900 font-normal">
                  {spreadsheetData.result}
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download Spreadsheet
                </button>
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