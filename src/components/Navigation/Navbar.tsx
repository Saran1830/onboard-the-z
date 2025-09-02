'use client';

/**
 * Navigation bar component for Board the Z application
 * Provides responsive navigation with loading states and mobile menu
 * 
 * @component Navbar
 * @author Board the Z Team
 * @version 1.0.0
 */

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { clientLogger } from '../../../shared/utils/clientLogger';
import { ROUTES } from '../../constants/routes';

// Context identifier for logging
const CONTEXT = 'Navbar';

/**
 * Navigation link configuration interface
 */
interface NavLink {
  href: string;
  label: string;
  description: string;
}

/**
 * Static navigation links configuration
 * Defines all main navigation items with descriptions for tooltips
 */
const LINKS: NavLink[] = [
  { 
    href: ROUTES.ONBOARDING.START, 
    label: 'Onboarding',
    description: 'Start your journey'
  },
  { 
    href: ROUTES.ADMIN, 
    label: 'Admin',
    description: 'Manage components'
  },
  { 
    href: ROUTES.DASHBOARD, 
    label: 'Data',
    description: 'View user data'
  },
];

/**
 * Responsive navigation bar component
 * Features glassmorphic design, loading states, and mobile-friendly menu
 * 
 * @returns JSX navigation bar element
 */
export default function Navbar() {
  // Next.js navigation hooks
  const pathname = usePathname();
  const router = useRouter();
  
  // Component state management
  const [loadingPath, setLoadingPath] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Handles navigation with loading state management
   * Prevents navigation to current page and provides visual feedback
   * 
   * @param href - Target route path
   * @param e - React mouse event
   */
  const handleNavigation = (href: string, e: React.MouseEvent) => {
    clientLogger.debug('Navigation initiated', CONTEXT, { 
      targetHref: href,
      currentPath: pathname,
      isCurrentPath: pathname === href
    });

    e.preventDefault();
    
    // Prevent navigation to current page
    if (pathname === href) {
      clientLogger.debug('Navigation cancelled - already on target page', CONTEXT, { href });
      return;
    }
    
    clientLogger.info('Navigating to new page', CONTEXT, { 
      from: pathname,
      to: href
    });

    // Set loading state and close mobile menu
    setLoadingPath(href);
    setIsMenuOpen(false);
    
    // Initiate navigation
    router.push(href);
    
    // Clear loading state after timeout (fallback in case navigation completes faster)
    setTimeout(() => {
      setLoadingPath(null);
      clientLogger.debug('Navigation loading state cleared', CONTEXT, { href });
    }, 1000);
  };

  /**
   * Toggles mobile menu visibility
   */
  const toggleMobileMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    
    clientLogger.debug('Mobile menu toggled', CONTEXT, { 
      isOpen: newState
    });
  };

  /**
   * Handles logo click navigation to home page
   */
  const handleLogoClick = () => {
    clientLogger.debug('Logo clicked - navigating to home', CONTEXT);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo Section */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick();
              }
            }}
            aria-label="Navigate to home page"
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
              onClick={toggleMobileMenu}
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