import { extendTheme, Theme, theme as chakraTheme } from "@chakra-ui/react";

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
    primary: "#162838",
    light: "#8A939B",
  },
  warning: chakraTheme.colors.red[700],
};

const theme: Theme = extendTheme({
  styles: {
    global: {
      "html, body, #root": {
        margin: 0,
        width: "100%",
        height: "100%",
        color: customColors.text.primary,
      },
      p: {
        marginBottom: "2",
        fontSize: { base: "md", md: "lg" },
      },
      a: {
        color: customColors.primary.regular,
        _hover: {
          opacity: 0.7,
        },
      },
    },
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
});

export default theme;
