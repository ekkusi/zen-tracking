import { useColorMode } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import React from "react";
import ReactSelect, {
  OptionProps,
  Props as ReactSelectProps,
  Styles,
} from "react-select";
import theme from "../../theme";

type SelectProps = Omit<ReactSelectProps, "theme"> & {};

const Select = (props: SelectProps): JSX.Element => {
  const colorModeProps = useColorMode();
  const primaryModeColor = mode(
    theme.colors.primary[500],
    theme.colors.primary[200]
  )(colorModeProps);
  const lightPrimaryModeColor = mode(
    theme.colors.primary[300],
    theme.colors.primary[100]
  )(colorModeProps);

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
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused ? primaryModeColor : theme.colors.gray[300],
      ":hover": {
        borderColor: primaryModeColor,
      },
    }),
  };
  return <ReactSelect styles={customStyles} {...props} />;
};

Select.defaultProps = {
  isSearchable: false,
};

export default Select;
