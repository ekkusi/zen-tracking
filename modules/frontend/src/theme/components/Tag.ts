import { ComponentSingleStyleConfig } from "@chakra-ui/react";

export const Tag: ComponentSingleStyleConfig = {
  baseStyle: ({ colorMode, colorScheme }) => {
    return {
      textTransform: "uppercase",
      bg: colorMode === "light" ? `${colorScheme}.500` : `${colorScheme}.300`,
      background:
        colorMode === "light" ? `${colorScheme}.500` : `${colorScheme}.300`,
      borderRadius: "50px",
    };
  },
  defaultProps: {
    colorScheme: "secondary",
  },
};
