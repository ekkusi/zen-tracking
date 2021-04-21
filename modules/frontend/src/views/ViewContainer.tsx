import { BoxProps, Container, Flex } from "@chakra-ui/react";
import Navigation from "components/functional/Navigation";
import React from "react";
import ThemeSwitch from "../components/functional/ThemeSwitch";
import useGlobal from "../store";

type ViewContainerProps = BoxProps & {
  isPlain?: boolean;
  isFullWidth?: boolean;
  hideNavigation?: boolean;
};

const ViewContainer = ({
  children,
  isPlain,
  isFullWidth,
  hideNavigation,
}: ViewContainerProps): JSX.Element => {
  const globalHideNavigation = useGlobal((state) => state.hideNavigation)[0];
  const renderNavigation = () => {
    if (hideNavigation || globalHideNavigation) return null;
    return isPlain ? (
      <Flex p="4" justifyContent="flex-end">
        <ThemeSwitch />
      </Flex>
    ) : (
      <Navigation />
    );
  };
  return (
    <>
      {renderNavigation()}
      <Container maxWidth={isFullWidth ? "auto" : "1000px"} p={isPlain ? 0 : 5}>
        {children}
      </Container>
    </>
  );
};

export default ViewContainer;
