import { ComponentMultiStyleConfig } from "@chakra-ui/react";

export const Tabs: ComponentMultiStyleConfig = {
  parts: ["root", "tablist", "tab", "tabpanels", "tabpanel", "indicator"],
  baseStyle: {
    tab: {
      _selected: {
        boxShadow: "none",
      },
      _focus: {
        boxShadow: "none",
      },
    },
  },
  defaultProps: {
    colorScheme: "primary",
  },
};
