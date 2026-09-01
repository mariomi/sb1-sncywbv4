import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureAttribution, initializeTracking, trackEvent, trackPageView } from '../lib/analytics';

export function Analytics() {
  const location = useLocation();

  useEffect(() => {
    initializeTracking();
    captureAttribution();

    const trackClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>('a, button');
      if (!element) return;

      const href = element instanceof HTMLAnchorElement ? element.href : '';
      const explicitEvent = element.dataset.track;

      if (explicitEvent === 'click_map') trackEvent('click_map');
      else if (explicitEvent === 'click_directions') trackEvent('click_directions');
      else if (href.startsWith('tel:')) trackEvent('click_phone');
      else if (/instagram\.com/i.test(href)) trackEvent('click_instagram');
      else if (/google\.[^/]+\/maps|maps\.app\.goo\.gl/i.test(href)) trackEvent('click_directions');
      else if (href && ['/book', '/reserve'].includes(new URL(href).pathname)) trackEvent('click_book');
    };

    document.addEventListener('click', trackClick);
    return () => document.removeEventListener('click', trackClick);
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
    if (location.pathname === '/menu') trackEvent('view_menu');
  }, [location.pathname, location.search]);

  return null;
}
