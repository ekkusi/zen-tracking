import { useMediaQuery } from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  const [isDisplayingInPwa] = useMediaQuery("(display-mode: standalone)");

  const history = useHistory();

  window.addEventListener("wheel", (e: WheelEvent) => {
    if (e.deltaY < -300 && e.pageY < 100 && isDisplayingInPwa) {
      console.log(e);
      window.location.href = history.location.pathname;
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
