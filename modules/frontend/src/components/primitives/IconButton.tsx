import React from "react";
import {
  ButtonProps,
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
};

const IconButton = (props: IconButtonProps) => {
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
  return <ChakraIconButton {...props} {...formattedProps} {...sizeProps} />;
};

IconButton.defaultProps = {
  color: "white",
  bg: "primary.regular",
  variant: "solid",
};

export default IconButton;
