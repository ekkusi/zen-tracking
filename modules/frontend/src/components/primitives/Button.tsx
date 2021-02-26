import React from "react";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";
import styled from "styled-components";

const BaseButtonProps: ChakraButtonProps = {
  textTransform: "uppercase",
  fontWeight: "bold",
  size: "md",
  fontSize: "xs",
  fontFamily: "body",
  border: "2px solid",
  borderRadius: "md",
  _hover: {
    opacity: 1,
  },
  _disabled: {
    cursor: "not-allowed",
    opacity: 0.3,
    border: "none",
  },
};

type ButtonProps = Omit<ChakraButtonProps, "bg" | "color" | "variant"> & {
  bg?: string;
  color?: string;
  variant?: string;
};

const Button = ({ color, bg, variant, ...rest }: ButtonProps): JSX.Element => {
  let variantProps: ButtonProps;
  switch (variant) {
    case "outline": {
      variantProps = {
        bg: color,
        color: bg,
        borderColor: bg,
        _hover: {
          bg,
          color,
        },
        _disabled: {
          ...BaseButtonProps._disabled,
          _hover: {
            bg: color,
            color: bg,
          },
        },
      };
      break;
    }
    default: {
      variantProps = {
        bg,
        color,
        _hover: {
          opacity: 0.7,
        },
      };
    }
  }

  // Prioritize variantProps -> generic custom props -> BaseButtonProps
  const props = { ...BaseButtonProps, ...rest, ...variantProps };
  return <ChakraButton {...props} />;
};

Button.defaultProps = {
  color: "white",
  bg: "primary.regular",
  variant: "solid",
};

export default Button;

/* ----------- Some default styles for buttons ---------- */

const PrimaryButton = styled(Button)<ButtonProps>``;

const AlertButton = styled(Button)<ButtonProps>``;

PrimaryButton.defaultProps = {
  color: "white",
  bg: "primary.regular",
};

AlertButton.defaultProps = {
  color: "warning",
  bg: "white",
  borderColor: "warning",
  variant: "outline",
};

export { PrimaryButton, AlertButton };
