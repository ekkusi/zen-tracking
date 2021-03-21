import { BoxProps, Container, Flex } from "@chakra-ui/react";
import Navigation from "components/Navigation";
import React from "react";
import ThemeSwitch from "../components/ThemeSwitch";

type ViewContainerProps = BoxProps & {
  isPlain?: boolean;
  isFullWidth?: boolean;
};

const ViewContainer = ({
  children,
  isPlain,
  isFullWidth,
}: ViewContainerProps): JSX.Element => {
  return (
    <>
      {isPlain ? (
        <Flex p="4" justifyContent="flex-end">
          <ThemeSwitch />
        </Flex>
      ) : (
        <Navigation />
      )}
      <Container maxWidth={isFullWidth ? "auto" : "1000px"} pb="5">
        {children}
      </Container>
    </>
  );
};

export default ViewContainer;
