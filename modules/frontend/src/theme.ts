import {
  extendTheme,
  Theme,
  theme as chakraTheme,
  ColorModeOptions,
} from "@chakra-ui/react";

const config: ColorModeOptions = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const customColors = {
  primary: {
    regular: "#53afff",
    light: "#53afff88",
  },
  secondary: {
    regular: "#ecf2f7",
    light: "#ecf2f788",
  },
  text: {
    dark: "white",
    light: "#162838",
  },
  bg: {
    dark: "#1A202C",
    light: "white",
  },
  warning: chakraTheme.colors.red[700],
};

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
        color: customColors.text[props.colorMode],
        bg: customColors.bg[props.colorMode],
      },
      body: {
        fontSize: { base: "md", md: "lg" },
      },
      p: {
        marginBottom: "2",
      },
      a: {
        color: customColors.primary.regular,
        cursor: "pointer",
        _hover: {
          opacity: 0.7,
        },
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {},
      defaultProps: {
        textTransform: "italic",
      },
    },
  },
  colors: {
    ...customColors,
  },
  shadows: {
    dark: "5px 5px 15px -5px black",
  },
  config,
});

export default theme;
