import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Switch,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { RiMenuLine } from "react-icons/ri";
import { Link, LinkProps } from "react-router-dom";
import useGlobal from "store";
import theme from "theme";
import chakraMotionWrapper from "util/chakraMotionWrapper";
import InstructionsModal from "./InstructionsModal";
import { PrimaryButton } from "./primitives/Button";
import { IconButtonWithRef } from "./primitives/IconButton";
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

const MotionText = chakraMotionWrapper(Text);

const NavigationLink = ({
  to = "#",
  children,
  ...rest
}: NavigationLinkProps) => {
  return (
    <MotionText
      as={Link}
      to={to}
      display="block"
      textAlign="center"
      fontSize="xl"
      py="1"
      whileHover={{
        scale: 1.2,
      }}
      whileTap={{
        scale: 1.2,
      }}
      {...rest}
    >
      {children}
    </MotionText>
  );
};

const NavigationBar = ({ onOpenDrawer }: NavigationTopBarProps) => {
  const updateUser = useGlobal(
    (store) => store.currentUser,
    (actions) => actions.updateUser
  )[1];
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex height="80px" alignItems="center" width="100%">
      <IconButtonWithRef
        as={motion.button}
        aria-label="Open navigation"
        size="md"
        ml="4"
        icon={<RiMenuLine />}
        onClick={onOpenDrawer}
        _hover={{ opacity: 1 }}
        whileHover={{
          rotate: 180,
          boxShadow: `0 0 15px 0px ${theme.colors.primary.regular}`,
        }}
        transition={{ ease: "ease" }}
      />
      <Flex alignItems="center" mr="4" ml={{ base: "auto", sm: "4" }}>
        <Text as="span" fontSize="lg" mr="2">
          {colorMode === "light" ? "Tulkoon yö!" : "Tulkoon valo!"}
        </Text>
        <Switch
          onChange={toggleColorMode}
          isChecked={colorMode === "dark"}
          size="lg"
          color="primary.regular"
        />
      </Flex>

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

  const listAnimations = {
    xPosEnd: (i: number) => ({
      x: 0,
      transition: {
        duration: 0.4,
        delay: i * 0.1,
      },
    }),
    xPosStart: {
      x: -200,
      transition: {
        when: "afterChildren",
      },
    },
  };

  return (
    <>
      <NavigationBar onOpenDrawer={onOpen} />
      <InstructionsModal
        hasOpenButton={false}
        isOpen={areInstructionsOpen}
        onClose={() => setAreInstructionsOpen(false)}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        {...rest}
        size="sm"
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Navigointijatata</DrawerHeader>

            <DrawerBody px="0">
              <Flex
                direction="column"
                justifyContent="center"
                display={{ base: "flex", sm: "none" }}
                mb="5"
              >
                <PrimaryButton onClick={() => updateUser(null)} mb="2" mx="2">
                  Kirjaudu ulos
                </PrimaryButton>
                <QuoteOfTheDay openButtonProps={{ mx: "2" }} />
              </Flex>

              <motion.ul initial="xPosStart" animate="xPosEnd">
                <motion.li variants={listAnimations} custom={0}>
                  <NavigationLink to="/" onClick={() => onClose()}>
                    Etusivu
                  </NavigationLink>
                </motion.li>
                <motion.li variants={listAnimations} custom={1}>
                  <NavigationLink to="/challenges" onClick={() => onClose()}>
                    Haasteet
                  </NavigationLink>
                </motion.li>
                <motion.li variants={listAnimations} custom={2}>
                  <NavigationLink
                    onClick={() => setAreInstructionsOpen(!areInstructionsOpen)}
                  >
                    Ohjeet
                  </NavigationLink>
                </motion.li>

                {process.env.NODE_ENV === "development" && (
                  <motion.li variants={listAnimations} custom={3}>
                    <NavigationLink to="/design" onClick={() => onClose()}>
                      Design
                    </NavigationLink>
                  </motion.li>
                )}
              </motion.ul>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default Navigation;
