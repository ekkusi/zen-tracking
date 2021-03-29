import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  const history = useHistory();

  let _startY: number;

  window.addEventListener(
    "touchstart",
    (e) => {
      _startY = e.touches[0]?.pageY || 0;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (e) => {
      const y = e.changedTouches[0]?.pageY || 0;
      if (document?.scrollingElement?.scrollTop === 0 && y > _startY) {
        window.location.href = history.location.pathname;
      }
    },
    { passive: true }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
