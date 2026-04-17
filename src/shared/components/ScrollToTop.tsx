import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  behavior?: 'auto' | 'smooth';
  excludePaths?: string[]; 
}

export function ScrollToTop(
  {
    behavior = 'smooth',
    excludePaths = []
  }: ScrollToTopProps = {}
) {
  const { pathname } = useLocation();

  // Scroll to top when pathname changes
  useEffect(() => {
    if (excludePaths.includes(pathname)) return;
    
    window.scrollTo({ top: 0, behavior });
  },[pathname, behavior, excludePaths]);

  return null;
}
