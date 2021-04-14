import { BoxProps, Container, Flex } from "@chakra-ui/react";
import Navigation from "components/functional/Navigation";
import React from "react";
import ThemeSwitch from "../components/functional/ThemeSwitch";
import useGlobal from "../store";

type ViewContainerProps = BoxProps & {
  isPlain?: boolean;
  isFullWidth?: boolean;
};

const ViewContainer = ({
  children,
  isPlain,
  isFullWidth,
}: ViewContainerProps): JSX.Element => {
  const hideNavigation = useGlobal((state) => state.hideNavigation)[0];
  const renderNavigation = () => {
    if (hideNavigation) return null;
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
      <Container maxWidth={isFullWidth ? "auto" : "1000px"} pb="5">
        {children}
      </Container>
    </>
  );
};

export default ViewContainer;
