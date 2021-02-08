import { extendTheme, Theme, theme as chakraTheme } from "@chakra-ui/react";

const theme: Theme = extendTheme({
  styles: {
    global: {
      p: {
        marginBottom: "2",
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
      light: chakraTheme.colors.green[300],
      dark: chakraTheme.colors.green[700],
    },
    warning: chakraTheme.colors.red[600],
  },
});

export default theme;
