import { useMediaQuery } from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import theme from "../../theme";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  const [isDisplayingInMobile] = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

  const history = useHistory();

  window.addEventListener("wheel", (e: WheelEvent) => {
    if (e.deltaY < -300 && e.pageY < 100 && isDisplayingInMobile) {
      window.location.href = history.location.pathname;
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
