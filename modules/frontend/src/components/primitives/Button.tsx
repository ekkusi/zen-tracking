import React from "react";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  forwardRef,
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
  whiteSpace: "nowrap",
  _hover: {
    opacity: 1,
  },
  _disabled: {
    cursor: "not-allowed",
    opacity: 0.3,
    border: "none",
  },
};

const ButtonDefaultProps = {
  color: "white",
  bg: "primary.regular",
  variant: "solid",
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
        _focus: {
          borderColor: color,
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
        _focus: {
          borderColor: bg,
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
        px: { base: 6, sm: 7 },
        py: { base: 3, sm: 5 },
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

Button.defaultProps = ButtonDefaultProps;

export default Button;

// If needs to be used with Framer-motion or pass as prop, use ButtonWithRef

const ButtonWithRef = forwardRef((props: ButtonProps, ref) => {
  const formattedProps = generateBaseButtonProps(props);
  return <ChakraButton ref={ref} {...formattedProps} />;
});

export { ButtonWithRef };

ButtonWithRef.defaultProps = ButtonDefaultProps;

/* IconButton */

/* ----------- Some default styles for buttons ---------- */

const PrimaryButton = styled(Button)<ButtonProps>``;

const AlertButton = styled(Button)<ButtonProps>``;

const CancelButton = styled(Button)<ButtonProps>``;

PrimaryButton.defaultProps = {
  color: "white",
  bg: "primary.regular",
};

AlertButton.defaultProps = {
  color: "white",
  bg: "warning",
};

CancelButton.defaultProps = {
  color: "gray.600",
  bg: "white",
};

export { PrimaryButton, AlertButton, CancelButton };
