import { useColorMode } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import React from "react";
import ReactSelect, { Props as ReactSelectProps, Styles } from "react-select";
import theme from "../../theme";

type SelectProps = Omit<ReactSelectProps, "theme"> & {};

const Select = (props: SelectProps): JSX.Element => {
  const colorModeProps = useColorMode();
  const primaryModeColor = mode(
    theme.colors.primary[500],
    theme.colors.primary[200]
  )(colorModeProps);
  const customStyles: Styles<any, boolean, any> = {
    option: (baseStyles, state) => ({
      ...baseStyles,
      background: state.isFocused ? primaryModeColor : theme.colors.white,
      color: state.isFocused ? theme.colors.white : theme.colors.black,
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

export default Select;
