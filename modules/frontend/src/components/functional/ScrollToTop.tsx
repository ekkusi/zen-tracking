import { useMediaQuery } from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  const history = useHistory();
  const [isDisplayingInPwa] = useMediaQuery("(display-mode: standalone)");

  if (isDisplayingInPwa) {
    let _startY: number | null;
    window.addEventListener(
      "touchstart",
      (e) => {
        const documentScrollTop = document.documentElement.scrollTop;

        // Only start possible refresh, if touch is happening on top or above page
        if (documentScrollTop <= 0) {
          _startY = e.touches[0]?.pageY || 0;
        } else _startY = null;
      },
      { passive: true }
    );

    window.addEventListener(
      "touchend",
      (e) => {
        const y = e.changedTouches[0]?.pageY || 0;

        const documentScrollTop = document.documentElement.scrollTop || 0;
        // Refresh is started on top of the page AND end touch is 200 pixels above the start touch
        if (_startY && documentScrollTop <= 0 && y > _startY + 150) {
          window.location.href = history.location.pathname;
        }
      },
      { passive: true }
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
