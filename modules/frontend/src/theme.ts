import { extendTheme, Theme, theme as chakraTheme } from "@chakra-ui/react";

const theme: Theme = extendTheme({
  styles: {
    global: {
      "html, body, #root": {
        margin: 0,
        width: "100%",
        height: "100%",
      },
      p: {
        marginBottom: "2",
        fontSize: { base: "md", md: "lg" },
      },
      a: {
        color: chakraTheme.colors.teal[500],
        _hover: {
          color: chakraTheme.colors.teal[700],
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
    primary: {
      regular: chakraTheme.colors.teal[500],
      light: chakraTheme.colors.teal[300],
      dark: chakraTheme.colors.teal[700],
    },
    secondary: {
      regular: chakraTheme.colors.green[500],
      light: chakraTheme.colors.green[400],
      dark: chakraTheme.colors.green[700],
    },
    warning: chakraTheme.colors.red[700],
  },
});

export default theme;
