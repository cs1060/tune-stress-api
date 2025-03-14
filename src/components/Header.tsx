
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon, LogOutIcon, MenuIcon, XIcon } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-in-out",
        scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
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
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-blue-500 transition-colors">Features</a>
          <a href="#test" className="text-sm font-medium hover:text-blue-500 transition-colors">Run Test</a>
          <a href="#about" className="text-sm font-medium hover:text-blue-500 transition-colors">About</a>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500" 
                  onClick={signOut}
                >
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-md p-4 flex flex-col space-y-4 md:hidden">
            <a href="#features" className="text-sm font-medium hover:text-blue-500 transition-colors p-2">Features</a>
            <a href="#test" className="text-sm font-medium hover:text-blue-500 transition-colors p-2">Run Test</a>
            <a href="#about" className="text-sm font-medium hover:text-blue-500 transition-colors p-2">About</a>
            
            {user ? (
              <>
                <Link to="/profile" className="text-sm font-medium hover:text-blue-500 transition-colors p-2">
                  Profile
                </Link>
                <button 
                  onClick={signOut}
                  className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors p-2 text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/auth" className="p-2">
                <Button size="sm" className="w-full">Sign In</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
