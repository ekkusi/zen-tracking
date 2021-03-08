import React from "react";
import {
  ButtonProps,
  forwardRef,
  IconButton as ChakraIconButton,
  IconButtonProps as ChakraIconButtonProps,
} from "@chakra-ui/react";
import { generateBaseButtonProps } from "./Button";

type IconButtonProps = Omit<
  ChakraIconButtonProps,
  "bg" | "color" | "variant"
> & {
  bg?: string;
  color?: string;
  variant?: string;
  withRef?: boolean;
};

const IconButtonDefaultProps = {
  color: "white",
  bg: "primary.regular",
  variant: "solid",
};

const generateIconProps = (props: IconButtonProps): ChakraIconButtonProps => {
  const formattedProps = generateBaseButtonProps(props);
  let sizeProps: ButtonProps;
  switch (props.size) {
    case "sm": {
      sizeProps = {
        py: { base: 1, sm: 1 },
        px: { base: 1, sm: 2 },
        css: {
          svg: {
            width: "1rem",
            height: "1.2rem",
          },
        },
      };
      break;
    }
    case "lg": {
      sizeProps = {
        py: { base: 3, sm: 3 },
        px: { base: 3, sm: 4 },
        css: {
          svg: {
            width: "2rem",
            height: "2.5rem",
          },
        },
      };
      break;
    }
    // If no value for prop is given -> represents md size
    default: {
      sizeProps = {
        py: { base: 2, sm: 2 },
        px: { base: 2, sm: 3 },
        css: {
          svg: {
            width: "1.3rem",
            height: "1.5rem",
          },
        },
      };
    }
  }
  return { ...props, ...formattedProps, ...sizeProps };
};

const IconButton = (props: IconButtonProps): JSX.Element => {
  const formattedProps = generateIconProps(props);
  return <ChakraIconButton {...formattedProps} />;
};

IconButton.defaultProps = IconButtonDefaultProps;

export default IconButton;

const IconButtonWithRef = forwardRef(
  (props: IconButtonProps, ref): JSX.Element => {
    const formattedProps = generateIconProps(props);
    return <ChakraIconButton ref={ref} {...formattedProps} />;
  }
);

export { IconButtonWithRef };

IconButtonWithRef.defaultProps = IconButtonDefaultProps;
