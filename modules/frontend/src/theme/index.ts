import { extendTheme, ColorModeOptions, Theme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import colors from "./colors";
import {
  Button,
  Switch,
  Checkbox,
  Textarea,
  Input,
  Spinner,
  Tabs,
} from "./components";

const config: ColorModeOptions = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// To see how chakra renders props by default, check directly from it's github.
// For example height in Button doesn't override with height, but with h property
// https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme/src/components

const theme: Theme = extendTheme({
  fonts: {
    heading: "Oxygen",
    body: "Raleway",
  },
  styles: {
    global: (props) => ({
      "html, body, #root": {
        margin: 0,
        width: "100%",
        height: "100%",
        color: colors.text[props.colorMode],
        bg: colors.bg[props.colorMode],
      },
      body: {
        fontSize: { base: "md", md: "lg" },
      },
      p: {
        marginBottom: "2",
        color: mode("gray.600", "gray.200")(props),
      },
      a: {
        color: mode(colors.primary[500], colors.primary[200])(props),
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        _hover: {
          opacity: 0.7,
        },
        _active: {
          bg: "inherit",
          background: "inherit",
          outline: "none",
        },
        transition: "opacity 0.2s",
      },
    }),
  },
  components: {
    Button,
    Switch,
    Checkbox,
    Input,
    Textarea,
    Spinner,
    Tabs,
  },
  colors: {
    ...colors,
  },
  shadows: {
    dark: "5px 5px 15px -5px black",
  },
  config,
});

export default theme;
