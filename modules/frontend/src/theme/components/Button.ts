import { ComponentSingleStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const Button: ComponentSingleStyleConfig = {
  baseStyle: {
    textTransform: "uppercase",
    fontWeight: "bold",
    border: "2px solid",
    borderRadius: "md",
    width: "auto",
    whiteSpace: "nowrap",
    color: "white",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    _focus: {
      boxShadow: "none",
    },
    _hover: {
      opacity: 0.8,
    },
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.3,
      border: "none",
      _hover: {
        opacity: 0.3,
      },
    },
    _active: {
      opacity: 0.6,
    },
  },
  variants: {
    ghost: (props) => {
      const { colorScheme } = props;
      return {
        border: "none",
        _hover: {
          bg: "inherit",
          background: "inherit",
          color: mode(`${colorScheme}.500`, `${colorScheme}.200`)(props),
        },
      };
    },
    outline: (props) => {
      const { colorScheme } = props;
      return {
        borderWidth: "2px",
        borderColor: `${colorScheme}.500`,
        _hover: {
          opacity: 1,
          bg: mode(`${colorScheme}.500`, "inherit")(props),
          color: mode(`white`, `${colorScheme}.500`)(props),
        },
      };
    },
    solid: (props) => {
      const { colorScheme } = props;
      return {
        border: "none",
        color: "white",
        bg: mode(`${colorScheme}.500`, `${colorScheme}.200`)(props),
        _active: {
          bg: mode(`${colorScheme}.500`, `${colorScheme}.200`)(props),
          background: mode(`${colorScheme}.500`, `${colorScheme}.200`)(props),
        },
      };
    },
    alert: () => ({
      color: "white",
      border: "none",
      bg: "warning",
    }),
    link: () => ({
      border: "none",
      px: 0,
      py: 0,
    }),
  },
  sizes: {
    sm: ({ variant }) => ({
      px: { base: 1, sm: 2 },
      py: { base: 1, sm: 2 },
      h: "auto",
      fontSize: "xs",
      "> svg": {
        width: "5",
        height: "5",
        mx: variant === "ghost" ? { base: -1, sm: -2 } : { base: 2, sm: -1 },
        my: variant === "ghost" ? { base: -1, sm: -2 } : { base: 1, sm: -1 },
      },
    }),
    md: ({ variant }) => ({
      fontSize: "sm",
      px: { base: 5, sm: 5 },
      py: { base: 3, sm: 4 },
      h: "auto",
      "> svg": {
        width: "6",
        height: "6",
        mx: variant === "ghost" ? { base: -3, sm: -5 } : { base: 3, sm: -1 },
        my: variant === "ghost" ? { base: -3, sm: -5 } : { base: 2, sm: -2 },
      },
    }),
    lg: ({ variant }) => ({
      fontSize: { base: "lg", md: "xl" },
      h: "auto",
      textTransform: "none",
      fontWeight: "normal",
      px: { base: 5, sm: 7 },
      py: { base: 4, sm: 6 },
      "> svg": {
        width: "10",
        height: "10",
        mx: variant === "ghost" ? { base: -6, sm: -7 } : { base: 4, sm: -3 },
        my: variant === "ghost" ? { base: 0, sm: -7 } : { base: 2, sm: -5 },
      },
    }),
  },
  defaultProps: {
    colorScheme: "primary",
    size: "md",
  },
};
