import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  FlexProps,
  Icon,
  SimpleGrid,
  Text,
  useColorMode,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { RiMenuLine, RiSwordLine, RiHome4Line } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { Link, LinkProps, useHistory } from "react-router-dom";
import useGlobal from "store";
import theme from "theme";
import chakraMotionWrapper from "util/chakraMotionWrapper";
import { IconType } from "react-icons";
import { DownloadIcon } from "@chakra-ui/icons";
import InfoModal from "./InfoModal";
import InstructionsModal from "./InstructionsModal";
import { PrimaryButton } from "../primitives/Button";
import { IconButtonWithRef } from "../primitives/IconButton";
import QuoteOfTheDay from "./QuoteOfTheDay";
import ThemeSwitch from "./ThemeSwitch";

// ===================== TopNavBar ====================

type NavigationTopBarProps = {
  onOpenDrawer: () => void;
};

const TopNavigationBar = ({ onOpenDrawer }: NavigationTopBarProps) => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const logout = useGlobal(
    () => {},
    (actions) => actions.logout
  )[1];

  const history = useHistory();

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logout();
    setLogoutLoading(false);
    history.push("/login");
  };

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
      <ThemeSwitch mr="4" ml={{ base: "auto", sm: "4" }} />

      <QuoteOfTheDay
        openButtonProps={{
          display: { base: "none", sm: "block" },
          ml: "auto",
          mr: "4",
        }}
      />
      <PrimaryButton
        onClick={() => handleLogout()}
        isLoading={logoutLoading}
        mr="4"
        display={{ base: "none", sm: "block" }}
      >
        Kirjaudu ulos
      </PrimaryButton>
    </Flex>
  );
};

// ===================== BottomNavBar ====================

type BottomBarLinkProps = FlexProps &
  LinkProps & {
    linkText: string;
    linkIcon: IconType;
  };

const BoxWithMotion = chakraMotionWrapper(Box);

const BottomBarLink = ({
  linkText,
  linkIcon,
  to,
  ...rest
}: BottomBarLinkProps) => {
  const history = useHistory();
  const { colorMode } = useColorMode();

  const isLinkCurrentPath = () => {
    return history.location.pathname === to;
  };

  const getLinkColor = () => {
    if (isLinkCurrentPath()) return "primary.regular";
    return colorMode === "dark" ? "text.dark" : "text.light";
  };

  const iconVariants = {
    active: {
      y: -3,
      scale: 1.1,
    },
    default: {
      y: 0,
      scale: 1.0,
    },
  };

  return (
    <Flex
      as={Link}
      to={to}
      color={getLinkColor()}
      direction="column"
      justifyContent="center"
      alignItems="center"
      pointerEvents={isLinkCurrentPath() ? "none" : "auto"}
      _hover={{ opacity: 1 }}
      {...rest}
    >
      <BoxWithMotion
        initial="default"
        animate={isLinkCurrentPath() ? "active" : "default"}
        variants={iconVariants}
      >
        <Icon as={linkIcon} w={6} h={6} />
      </BoxWithMotion>

      <Text as="span" fontSize="sm">
        {linkText}
      </Text>
    </Flex>
  );
};

const GridWithFlex = chakraMotionWrapper(SimpleGrid);

const BottomNavigationBar = () => {
  const [bottomBarState, setBottomBarState] = useState<"hidden" | "visible">(
    "visible"
  );

  const user = useGlobal((state) => state.currentUser)[0];

  const { colorMode } = useColorMode();

  let lastScrollTop = window.pageYOffset;

  const onScroll = () => {
    const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (st > lastScrollTop + 100) {
      lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
      if (bottomBarState === "visible") {
        setBottomBarState("hidden");
      }
    } else if (st < lastScrollTop - 100) {
      lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
      if (bottomBarState === "hidden") {
        setBottomBarState("visible");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  const bottomBarVariants = {
    hidden: { bottom: -100 },
    visible: { bottom: 0 },
  };

  return (
    <>
      <GridWithFlex
        width="100%"
        boxShadow="-5px 0 10px -5px black"
        position="fixed"
        left="0"
        pt="3"
        pb="2"
        px="3"
        zIndex="100"
        bg={colorMode === "dark" ? "gray.700" : "white"}
        columns={3}
        initial="hidden"
        animate={bottomBarState}
        variants={bottomBarVariants}
      >
        <BottomBarLink
          as={Link}
          to="/"
          linkText="Etusivu"
          linkIcon={RiHome4Line}
        />
        <BottomBarLink
          as={Link}
          to="/challenges"
          linkText="Haasteet"
          linkIcon={RiSwordLine}
        />
        <BottomBarLink
          as={Link}
          to={`/profile/${user.name}`}
          linkText="Omat jutskat"
          linkIcon={FiUser}
        />
      </GridWithFlex>
    </>
  );
};

// ===================== Navigation ====================

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

type NavigationProps = Omit<DrawerProps, "children" | "isOpen" | "onClose"> & {
  isOpen?: boolean;
  onClose?: () => void;
};

const Navigation = ({
  isOpen: customIsOpen,
  onClose: customOnClose,
  ...rest
}: NavigationProps): JSX.Element => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [areInstructionsOpen, setAreInstructionsOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const [isMobile] = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const logout = useGlobal(
    () => {},
    (actions) => actions.logout
  )[1];

  const user = useGlobal((state) => state.currentUser)[0];
  const promptEvent = useGlobal((state) => state.promptEvent)[0];

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: customOnClose,
    isOpen: customIsOpen,
  });

  const history = useHistory();

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logout();
    setLogoutLoading(false);
    history.push("/login");
  };

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
      <TopNavigationBar onOpenDrawer={onOpen} />
      {isMobile && <BottomNavigationBar />}
      <InstructionsModal
        hasOpenButton={false}
        isOpen={areInstructionsOpen}
        onClose={() => setAreInstructionsOpen(false)}
      />
      <InfoModal
        hasOpenButton={false}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
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
                <PrimaryButton
                  onClick={() => handleLogout()}
                  isLoading={logoutLoading}
                  mb="2"
                  mx="2"
                >
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
                    to={`/profile/${user.name}`}
                    onClick={() => onClose()}
                  >
                    Omat jutskat
                  </NavigationLink>
                </motion.li>
                <motion.li variants={listAnimations} custom={3}>
                  <NavigationLink
                    onClick={() => setAreInstructionsOpen(!areInstructionsOpen)}
                  >
                    Ohjeet
                  </NavigationLink>
                </motion.li>

                <motion.li variants={listAnimations} custom={4}>
                  <NavigationLink
                    onClick={() => setIsInfoModalOpen(!isInfoModalOpen)}
                  >
                    Info
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
              {promptEvent && (
                <PrimaryButton
                  onClick={() => promptEvent.prompt()}
                  leftIcon={<DownloadIcon />}
                  position="absolute"
                  left="50%"
                  bottom="20px"
                  transform="translateX(-50%)"
                >
                  Lataa sovellus
                </PrimaryButton>
              )}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default Navigation;
