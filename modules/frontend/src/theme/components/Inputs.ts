import {
  ComponentSingleStyleConfig,
  SystemStyleObject,
  ThemingPropsThunk,
} from "@chakra-ui/react";
import { mode, getColor } from "@chakra-ui/theme-tools";

const inputBaseStyle: ThemingPropsThunk<SystemStyleObject> = (props) => {
  const { colorScheme, theme } = props;
  const modeColor = getColor(
    theme,
    mode(`${colorScheme}.500`, `${colorScheme}.200`)(props)
  );
  return {
    field: {
      fontSize: "sm",
      borderRadius: "5px",
      _invalid: {
        borderColor: "warning",
        boxShadow: `0 0 0 1px ${theme.colors.warning}`,
        _focus: {
          borderColor: "warning",
          boxShadow: `0 0 0 1px ${theme.colors.warning}`,
        },
      },
      _focus: {
        borderColor: modeColor,
        boxShadow: `0 0 0 1px ${modeColor}`,
      },
      _disabled: {
        bg: "gray.200",
        pointerEvents: "none",
      },
      _readOnly: {
        opacity: 1,
        pointerEvents: "none",
      },
    },
  };
};

export const Input: ComponentSingleStyleConfig = {
  variants: {
    outline: inputBaseStyle,
    filled: inputBaseStyle,
    flushed: inputBaseStyle,
    unstyled: inputBaseStyle,
  },
  defaultProps: {
    colorScheme: "primary",
    "data-private": true,
  },
};

export const Textarea: ComponentSingleStyleConfig = {
  variants: {
    ...Input.variants,
  },
  defaultProps: {
    colorScheme: "primary",
    "data-private": true,
  },
};
