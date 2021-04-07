import { ComponentSingleStyleConfig } from "@chakra-ui/react";

export const Switch: ComponentSingleStyleConfig = {
  baseStyle: {
    track: {
      _focus: {
        boxShadow: "none",
      },
    },
  },
  defaultProps: {
    colorScheme: "primary",
  },
};
