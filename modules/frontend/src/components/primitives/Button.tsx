import React from "react";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";
import styled from "styled-components";

const BaseButtonProps: ChakraButtonProps = {
  textTransform: "uppercase",
  fontWeight: "normal",
  size: "md",
  fontFamily: "body",
  border: "2px solid",
  borderRadius: "md",
  width: "auto",
  height: "auto",
  whiteSpace: "normal",
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

export const generateBaseButtonProps = ({
  color,
  bg,
  variant,
  size,
  ...rest
}: ButtonProps): ChakraButtonProps => {
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
        borderColor: bg,
        _hover: {
          opacity: 0.7,
        },
      };
    }
  }
  let sizeProps: ButtonProps;
  switch (size) {
    case "sm": {
      sizeProps = {
        px: { base: 2, sm: 3 },
        py: { base: 2, sm: 4 },
        fontWeight: "bold",
        fontSize: "xxs",
      };
      break;
    }
    case "lg": {
      sizeProps = {
        fontSize: { base: "lg", md: "xl" },
        textTransform: "none",
        px: { base: 4, sm: 5 },
        py: { base: 4, sm: 5 },
      };
      break;
    }
    // If no value for prop is given -> represents md size
    default: {
      sizeProps = {
        fontSize: { base: "xs", md: "sm" },
        py: { base: 3, sm: 3 },
        px: { base: 3, sm: 5 },
      };
    }
  }

  // Prioritize variantProps -> generic custom props -> BaseButtonProps
  const props: ChakraButtonProps = {
    ...BaseButtonProps,
    ...rest,
    ...variantProps,
    ...sizeProps,
  };
  return props;
};

const Button = (props: ButtonProps): JSX.Element => {
  const formattedProps = generateBaseButtonProps(props);
  return <ChakraButton {...formattedProps} />;
};

Button.defaultProps = {
  color: "white",
  bg: "primary.regular",
  variant: "solid",
};

export default Button;

/* IconButton */

/* ----------- Some default styles for buttons ---------- */

const PrimaryButton = styled(Button)<ButtonProps>``;

const AlertButton = styled(Button)<ButtonProps>``;

PrimaryButton.defaultProps = {
  color: "white",
  bg: "primary.regular",
};

AlertButton.defaultProps = {
  color: "white",
  bg: "warning",
};

export { PrimaryButton, AlertButton };
