import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  const firstMount = useRef(true);

  useEffect(() => {
    // Do not scroll on the very first mount (page reload).
    // Only scroll to top when the user navigates within the SPA.
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;