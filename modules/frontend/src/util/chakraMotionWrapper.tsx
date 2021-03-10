import React from "react";
import { isValidMotionProp, motion } from "framer-motion";
import { As, forwardRef } from "@chakra-ui/react";

// TODO: Currently doesn't return typed component and show prop suggestions, because typing was hard.
// Should return motion wrapped Chakra component, merging Chakra component props with
// MotionProps, but that seems a bit hard. Needs further investigation.

// NOTE: If the component you're wrapping is not a Chakra component, try using default motion(Component) wrapping first
const chakraMotionWrapper = <Props extends object, ComponentType extends As>(
  Component: any
) => {
  const ComponentWithProps = forwardRef<Props, ComponentType>((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    );
    return <Component ref={ref} {...chakraProps} />;
  });
  return motion<typeof Component>(ComponentWithProps);
};

export default chakraMotionWrapper;
