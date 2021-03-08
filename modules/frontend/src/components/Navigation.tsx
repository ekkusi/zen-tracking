import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { RiMenuLine } from "react-icons/ri";
import { Link, LinkProps } from "react-router-dom";
import useGlobal from "store";
import styled from "styled-components";
import InstructionsModal from "./InstructionsModal";
import { PrimaryButton } from "./primitives/Button";
import IconButton from "./primitives/IconButton";
import QuoteOfTheDay from "./QuoteOfTheDay";

type NavigationProps = Omit<DrawerProps, "children" | "isOpen" | "onClose"> & {
  isOpen?: boolean;
  onClose?: () => void;
};

type NavigationTopBarProps = {
  onOpenDrawer: () => void;
};

type NavigationLinkProps = Omit<LinkProps, "to"> & {
  to?: string;
};

const StyledLink = styled(Link)`
  ${({ theme }) => `
    display: block;
    padding: ${theme.space[1]} ${theme.space[2]};
    font-size: ${theme.fontSizes.xl};
    text-align: center;
  `}
`;

const NavigationLink = ({
  to = "#",
  children,
  ...rest
}: NavigationLinkProps) => {
  return (
    <StyledLink to={to} {...rest}>
      {children}
    </StyledLink>
  );
};

const NavigationBar = ({ onOpenDrawer }: NavigationTopBarProps) => {
  const updateUser = useGlobal(
    (store) => store.currentUser,
    (actions) => actions.updateUser
  )[1];
  return (
    <Flex
      height="80px"
      alignItems="center"
      boxShadow="2px -2px 20px -5px black"
      width="100%"
    >
      <IconButton
        aria-label="Open navigation"
        size="md"
        ml="4"
        icon={<RiMenuLine />}
        onClick={onOpenDrawer}
      />
      <QuoteOfTheDay
        openButtonProps={{
          display: { base: "none", sm: "block" },
          ml: "auto",
          mr: "4",
        }}
      />
      <PrimaryButton
        onClick={() => updateUser(null)}
        mr="4"
        display={{ base: "none", sm: "block" }}
      >
        Kirjaudu ulos
      </PrimaryButton>
    </Flex>
  );
};

const Navigation = ({
  isOpen: customIsOpen,
  onClose: customOnClose,
  ...rest
}: NavigationProps): JSX.Element => {
  const updateUser = useGlobal(
    (store) => store.currentUser,
    (actions) => actions.updateUser
  )[1];
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: customOnClose,
    isOpen: customIsOpen,
  });
  const [areInstructionsOpen, setAreInstructionsOpen] = useState(false);

  return (
    <>
      <NavigationBar onOpenDrawer={onOpen} />
      <InstructionsModal
        hasOpenButton={false}
        isOpen={areInstructionsOpen}
        onClose={() => setAreInstructionsOpen(false)}
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} {...rest}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Navigointijata</DrawerHeader>

            <DrawerBody px="0">
              <PrimaryButton
                onClick={() => updateUser(null)}
                display={{ base: "block", sm: "none" }}
              >
                Kirjaudu ulos
              </PrimaryButton>
              <QuoteOfTheDay
                openButtonProps={{ display: { base: "block", sm: "none" } }}
              />

              <NavigationLink to="/" onClick={() => onClose()}>
                Etusivu
              </NavigationLink>
              <NavigationLink to="/challenges" onClick={() => onClose()}>
                Haasteet
              </NavigationLink>
              <NavigationLink
                onClick={() => setAreInstructionsOpen(!areInstructionsOpen)}
              >
                Ohjeet
              </NavigationLink>

              {process.env.NODE_ENV === "development" && (
                <NavigationLink to="/design" onClick={() => onClose()}>
                  Design
                </NavigationLink>
              )}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default Navigation;
