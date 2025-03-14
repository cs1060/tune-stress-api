
const Footer = () => {
  return (
    <footer className="py-10 px-6 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
                  <path d="M8 7h.01" />
                  <path d="M12 7h.01" />
                  <path d="M16 7h.01" />
                  <path d="M12 11h.01" />
                  <path d="M8 11h.01" />
                  <path d="M16 11h.01" />
                </svg>
              </div>
              <span className="text-xl font-semibold tracking-tight">StressAPI</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
              The high-performance load testing tool for FastAPI
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h3 className="text-sm font-semibold mb-2">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">Features</a></li>
                <li><a href="#test" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">Run Test</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} StressAPI. All rights reserved.
            </div>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Twitter"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="GitHub"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="LinkedIn"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
