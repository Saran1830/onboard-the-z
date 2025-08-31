'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const LINKS = [
  { 
    href: '/onboarding/1', 
    label: 'Onboarding',
    description: 'Start your journey'
  },
  { 
    href: '/admin', 
    label: 'Admin',
    description: 'Manage components'
  },
  { 
    href: '/data', 
    label: 'Data',
    description: 'View user data'
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingPath, setLoadingPath] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === href) return;
    
    setLoadingPath(href);
    setIsMenuOpen(false);
    router.push(href);
    
    setTimeout(() => {
      setLoadingPath(null);
    }, 1000);
  };


  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div 
            onClick={() => router.push('/')}
            className="flex items-center cursor-pointer group"
          >
            <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Board the Z
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {LINKS.map(link => {
              const active = pathname?.startsWith(link.href);
              const isLoading = loadingPath === link.href;
              
              return (
                <div key={link.href} className="relative group">
                  <a
                    href={link.href}
                    onClick={(e) => handleNavigation(link.href, e)}
                    className={`
                      flex items-center justify-center px-4 py-2 rounded-xl font-medium text-sm
                      transition-all duration-200 relative overflow-hidden min-w-[100px]
                      ${active 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                      }
                      ${isLoading ? 'cursor-wait opacity-70' : 'cursor-pointer'}
                    `}
                  >
                    <span>{link.label}</span>
                    {isLoading && (
                      <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin ml-2" />
                    )}
                    
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute bottom-0 left-1/2 w-6 h-0.5 bg-white rounded-full transform -translate-x-1/2" />
                    )}
                  </a>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {link.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 relative flex flex-col justify-center">
                <div className={`w-full h-0.5 bg-gray-700 rounded transition-all duration-200 ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`} />
                <div className={`w-full h-0.5 bg-gray-700 rounded mt-1 transition-all duration-200 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`w-full h-0.5 bg-gray-700 rounded mt-1 transition-all duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-2 space-y-1">
              {LINKS.map(link => {
                const active = pathname?.startsWith(link.href);
                const isLoading = loadingPath === link.href;
                
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavigation(link.href, e)}
                    className={`
                      flex items-center px-4 py-3 rounded-lg font-medium text-base
                      transition-all duration-200
                      ${active 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                      }
                      ${isLoading ? 'cursor-wait opacity-70' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{link.label}</div>
                      <div className={`text-xs mt-0.5 ${active ? 'text-blue-100' : 'text-gray-600'}`}>
                        {link.description}
                      </div>
                    </div>
                    {isLoading && (
                      <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    )}
                  </a>
                );
              })}
              
            </div>
          </div>
        )}
      </div>
    </header>
  );
}