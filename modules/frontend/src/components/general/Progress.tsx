import { BoxProps, Box, useColorMode } from "@chakra-ui/react";
import { Transition } from "framer-motion";
import React from "react";
import chakraMotionWrapper from "../../util/chakraMotionWrapper";

type CustomProgressProps = Omit<BoxProps, "transition"> & {
  bgColor?: string;
  isAnimated?: boolean;
  min?: number;
  max?: number;
  transition?: Transition;
  value: number;
  containerProps?: BoxProps;
};
const BoxWithMotion = chakraMotionWrapper(Box);

const Progress = ({
  isAnimated = true,
  width = "100%",
  height = "4em",
  bgColor = "gray.200",
  min = 0,
  max = 100,
  value,
  containerProps,
  ...rest
}: CustomProgressProps): JSX.Element => {
  const getValueInPercentage = () => {
    return (value / (max - min)) * 100;
  };

  const { colorMode } = useColorMode();

  return (
    <Box
      width={width}
      bg={bgColor}
      overflow="hidden"
      borderRadius="md"
      {...containerProps}
    >
      <BoxWithMotion
        width={`${getValueInPercentage()}%`}
        height={height}
        bg={colorMode === "light" ? "primary.500" : "primary.200"}
        initial={{
          x: isAnimated ? "-100%" : 0,
        }}
        animate={{ x: 0 }}
        transition={{
          duration: 1,
        }}
        {...rest}
      />
    </Box>
  );
};

export default Progress;
