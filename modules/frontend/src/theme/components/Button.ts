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
    },
  },
  variants: {
    ghost: (props) => {
      const { colorScheme } = props;
      return {
        border: "none",
        _hover: {
          opacity: 1,
          bg: mode(`${colorScheme}.500`, "inherit")(props),
          color: mode(`white`, "inherit"),
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
      };
    },
    alert: () => ({
      color: "white",
      border: "none",
      bg: "warning",
    }),
  },
  sizes: {
    sm: {
      px: { base: 2, sm: 3 },
      py: { base: 2, sm: 4 },
      fontWeight: "bold",
      fontSize: "xs",
    },
    md: {
      fontSize: { base: "xs", md: "sm" },
      py: { base: 3, sm: 5 },
      px: { base: 3, sm: 5 },
    },
    lg: {
      fontSize: { base: "lg", md: "xl" },
      textTransform: "none",
      px: { base: 6, sm: 7 },
      py: { base: 5, sm: 7 },
    },
  },
  defaultProps: {
    colorScheme: "primary",
    size: "md",
  },
};

export const IconButton: ComponentSingleStyleConfig = {
  ...Button,
  sizes: {
    lg: {
      px: { base: 0, sm: 0 },
    },
  },
  variants: {
    ghost: {
      px: 0,
      py: 0,
    },
  },
};
