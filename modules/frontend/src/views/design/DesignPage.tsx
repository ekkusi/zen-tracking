import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Button,
  IconButton,
  SimpleGrid,
  Switch,
  Text,
} from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import React from "react";

const RoundedBox = ({ children }: BoxProps): JSX.Element => (
  <Box mb="5" p="5" boxShadow="2px 2px 10px -3px black" borderRadius="5px">
    {children}
  </Box>
);

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
        <Heading.H1 textAlign="center" w="100%">
          Paragraphs and links etc
        </Heading.H1>
        <Text>Text default, normal paragraph</Text>
        <Text as="span">Text as span, display</Text>
        <br />
        <Text as="a">Text as link (a-tag)</Text>
      </RoundedBox>
      <RoundedBox>
        <Heading.H1 fontWeight="bold" textAlign="center" w="100%">
          Button styles
        </Heading.H1>
        <SimpleGrid columns={2} spacing={5}>
          <Button>Default button</Button>
          <Button size="sm">Small button</Button>
          <Button size="lg">Large button</Button>
          <Button variant="outline">Default outline</Button>
          <Button variant="alert">Alert button</Button>
          <Button size="lg" variant="alert">
            Large alert
          </Button>

          <Button>Chakra button, default colorScheme</Button>
          <Button size="sm">Chakra button, default small</Button>

          <Button size="lg">Chakra button, default large</Button>
          <Button variant="outline">Chakra button, default outline</Button>
          <Button variant="link">Chakra button, default link</Button>
          <Button variant="ghost">Chakra button, default ghost</Button>
          <Button variant="unstyled">Chakra button, default unstyled</Button>
          <Button variant="solid">Chakra button, default solid</Button>

          <Button colorScheme="secondary">
            Chakra button, secondary colorScheme
          </Button>
          <Button colorScheme="secondary" size="sm">
            Chakra button, secondary colorScheme, sm
          </Button>
          <Button colorScheme="secondary" size="lg">
            Chakra button, secondary colorScheme
          </Button>
          <Button colorScheme="secondary" variant="outline">
            Chakra button, outline secondary
          </Button>
        </SimpleGrid>
      </RoundedBox>
      <RoundedBox>
        <IconButton icon={<CloseIcon />} aria-label="terve" />
        <IconButton icon={<CloseIcon />} size="sm" aria-label="terve" />

        <IconButton icon={<CloseIcon />} size="lg" aria-label="terve" />

        <IconButton
          icon={<CloseIcon />}
          variant="ghost"
          size="md"
          aria-label="terve"
        />
        <IconButton
          icon={<CloseIcon />}
          variant="ghost"
          size="lg"
          aria-label="terve"
        />
      </RoundedBox>
      <RoundedBox>
        <Heading.H1>Form elements</Heading.H1>
        <Switch>Toggle default</Switch>
      </RoundedBox>
    </Box>
  );
};

export default DesignPage;
