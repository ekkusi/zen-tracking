import { useColorMode } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import theme from "../theme";

const usePrimaryColor = (colorMode: "light" | "dark" = "dark"): string => {
  const colorModeProps = useColorMode();

  if (colorMode === "dark") {
    return mode(
      theme.colors.primary[500],
      theme.colors.primary[200]
    )(colorModeProps);
  }
  return mode(
    theme.colors.primary[300],
    theme.colors.primary[100]
  )(colorModeProps);
};

export default usePrimaryColor;
