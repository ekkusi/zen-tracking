import { BoxProps, Container, Flex } from "@chakra-ui/react";
import Navigation from "components/functional/Navigation";
import { AnimatePresence, motion, Transition, Variant } from "framer-motion";
import React from "react";

import ThemeSwitch from "../components/functional/ThemeSwitch";
import useGlobal from "../store";
import chakraMotionWrapper from "../util/chakraMotionWrapper";

type AnimationVariants = {
  from: Variant;
  to: Variant;
};

type ViewContainerProps = Omit<BoxProps, "animation" | "transition"> & {
  isPlain?: boolean;
  isFullWidth?: boolean;
  hideNavigation?: boolean;
  animatePageTransition?: boolean;
  animation?: AnimationVariants;
  exitAnimation?: Variant;
  transition?: Transition;
};

const ContainerWithMotion = chakraMotionWrapper(Container);

const ViewContainer = ({
  children,
  isPlain,
  isFullWidth,
  hideNavigation,
  animatePageTransition = false,
  animation = {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  exitAnimation = {
    opacity: 0,
  },
  transition: customTransitionProps,
}: ViewContainerProps): JSX.Element => {
  const transitionProps = customTransitionProps || {
    duration: animatePageTransition ? 0.3 : 0,
  };

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
      <AnimatePresence initial={false}>{renderNavigation()}</AnimatePresence>
      <ContainerWithMotion
        as={motion.div}
        maxWidth={isFullWidth ? "auto" : "1000px"}
        p={isPlain ? 0 : 5}
        initial={animatePageTransition ? "from" : "to"}
        animate="to"
        variants={animation}
        exit={animatePageTransition ? exitAnimation : undefined}
        transition={transitionProps}
      >
        {children}
      </ContainerWithMotion>
    </>
  );
};

export default ViewContainer;
