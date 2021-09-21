import { Text, Box, BoxProps } from "@chakra-ui/react";
import React from "react";
import ReactSelect, {
  OptionProps,
  Props as ReactSelectProps,
  Styles,
} from "react-select";
import usePrimaryColor from "../../hooks/usePrimaryColor";
import theme from "../../theme";

type SelectProps = Omit<ReactSelectProps, "theme"> & {
  containerProps?: BoxProps;
  error?: string;
};

export type OptionType = {
  value: string;
  label: string;
};

const Select = ({
  containerProps,
  error,
  ...props
}: SelectProps): JSX.Element => {
  const primaryModeColor = usePrimaryColor();
  const lightPrimaryModeColor = usePrimaryColor("light");

  const getOptionBgColor = (state: OptionProps<any, boolean, any>) => {
    if (state.isSelected) {
      return primaryModeColor;
    }
    if (state.isFocused) {
      return lightPrimaryModeColor;
    }
    return theme.colors.white;
  };

  const customStyles: Styles<any, boolean, any> = {
    option: (baseStyles, state) => ({
      ...baseStyles,
      background: getOptionBgColor(state),
      color:
        state.isFocused || state.isSelected
          ? theme.colors.white
          : theme.colors.black,
    }),
    menuList: (baseStyles) => ({
      ...baseStyles,
      paddingTop: "0",
      paddingBottom: "0",
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      overflow: "hidden",
      zIndex: 100,
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused ? primaryModeColor : theme.colors.gray[300],
      ":hover": {
        borderColor: primaryModeColor,
      },
    }),
  };
  return (
    <Box
      width={{ base: "100%", sm: "400px" }}
      color="text.light"
      {...containerProps}
    >
      <ReactSelect styles={customStyles} {...props} />
      {error && <Text color="warning">{error}</Text>}
    </Box>
  );
};

export default Select;
