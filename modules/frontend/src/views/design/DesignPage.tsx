import {
  As,
  Box,
  BoxProps,
  ChakraComponent,
  Flex,
  forwardRef,
  propNames,
  Text,
} from "@chakra-ui/react";
import { AlertButton, PrimaryButton } from "components/primitives/Button";
import Heading from "components/primitives/Heading";
import {
  CustomDomComponent,
  isValidMotionProp,
  motion,
  MotionProps,
} from "framer-motion";
import React from "react";
import chakraMotionWrapper from "util/chakraMotionWrapper";

const RoundedBox = ({ children }: BoxProps): JSX.Element => (
  <Box mb="5" p="5" boxShadow="2px 2px 10px -3px black" borderRadius="5px">
    {children}
  </Box>
);

const MotionBox = chakraMotionWrapper(Box);

const DesignPage = () => {
  return (
    <Box>
      <Heading.H1>Design page</Heading.H1>
      <Text>This page is solely for testing designs and components etc</Text>
      <RoundedBox>
        <Heading.H1 fontWeight="bold" textAlign="center" w="100%">
          Heading styles:
        </Heading.H1>
        <Heading.H1>Heading 1</Heading.H1>
        <Heading.H2>Heading 2</Heading.H2>
        <Heading.H3>Heading 3</Heading.H3>
      </RoundedBox>
      <RoundedBox>
        <Flex
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Heading.H1 fontWeight="bold" textAlign="center" w="100%">
            Button styles
          </Heading.H1>
          <PrimaryButton>Default button</PrimaryButton>
          <PrimaryButton size="sm">Small button</PrimaryButton>
          <PrimaryButton size="lg">Large button</PrimaryButton>
          <PrimaryButton variant="outline">Default outline</PrimaryButton>
          <AlertButton>Default alert button</AlertButton>
          <AlertButton size="lg" variant="outline">
            Large, outline
          </AlertButton>
        </Flex>
      </RoundedBox>
      <RoundedBox>
        <Flex
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Text>Tekstiä</Text>
        </Flex>
      </RoundedBox>
      <MotionBox mb="5" drag="x" dragConstraints={{ left: -100, right: 100 }}>
        <Text>Testi</Text>
      </MotionBox>
    </Box>
  );
};

export default DesignPage;
