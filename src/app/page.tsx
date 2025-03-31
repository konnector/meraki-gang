export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center pt-70 p-3 bg-[#FCFCF9]">
      <div className="w-full max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-medium text-[#1a1a1a]">
          What do you want to know?
        </h1>
        
        <div className="relative w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask anything..."
              className="w-full p-3 pr-12 text-base bg-white border border-[#e5e7eb] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button className="p-1.5 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </button>
              <button className="p-1.5 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </button>
              <button className="p-1.5 bg-[#f5f5f5] rounded-lg text-gray-700 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="absolute left-3 top-full mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#f5f5f5] px-2.5 py-0.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <span className="text-xs text-gray-600">Deep Research</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 w-full p-3 border-t bg-white">
        <nav className="max-w-6xl mx-auto flex items-center justify-center gap-5 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-900">Pro</a>
          <a href="#" className="hover:text-gray-900">Enterprise</a>
          <a href="#" className="hover:text-gray-900">API</a>
          <a href="#" className="hover:text-gray-900">Blog</a>
          <a href="#" className="hover:text-gray-900">Careers</a>
          <a href="#" className="hover:text-gray-900">Store</a>
          <a href="#" className="hover:text-gray-900">Finance</a>
          <div className="relative group">
            <button className="hover:text-gray-900 flex items-center gap-1">
              English
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>
        </nav>
      </footer>
    </main>
  );
}
