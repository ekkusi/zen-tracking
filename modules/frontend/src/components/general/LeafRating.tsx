import { Box, BoxProps } from "@chakra-ui/react";
import { motion, MotionProps } from "framer-motion";
import React from "react";
import { useTheme } from "styled-components";
import chakraMotionWrapper from "../../util/chakraMotionWrapper";

const BoxWithMotion = chakraMotionWrapper(Box);

type MotionLeafIconProps = {
  delay?: number;
  duration?: number;
  fillPercentage?: number;
  gradientId: string;
  size?: string;
  isAnimated?: boolean;
};

const MotionLeafIcon = ({
  delay = 2,
  duration = 1,
  fillPercentage = 100,
  gradientId,
  size = "3em",
  isAnimated = true,
}: MotionLeafIconProps) => {
  const theme = useTheme();

  const getDelayString = () => {
    return isAnimated ? `${delay}s` : "0s";
  };

  const getToValue = () => {
    return `${fillPercentage / 100}`;
  };

  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      viewBox="0 0 512 512"
      focusable="false"
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId}>
          <stop offset="0" stopColor={theme.colors.primary[500]}>
            <animate
              attributeName="offset"
              dur={`${duration}s`}
              fill="freeze"
              from={isAnimated ? "0" : getToValue()}
              to={getToValue()}
              begin={getDelayString()}
            />
          </stop>
          <stop offset="0" stopColor={theme.colors.gray[100]}>
            <animate
              dur={`${duration}s`}
              attributeName="offset"
              fill="freeze"
              from={isAnimated ? "0" : getToValue()}
              to={getToValue()}
              begin={getDelayString()}
            />
          </stop>
        </linearGradient>
      </defs>
      <motion.path
        d="M161.35 242a16 16 0 0122.62-.68c73.63 69.36 147.51 111.56 234.45 133.07 11.73-32 12.77-67.22 2.64-101.58-13.44-45.59-44.74-85.31-90.49-114.86-40.84-26.38-81.66-33.25-121.15-39.89-49.82-8.38-96.88-16.3-141.79-63.85-5-5.26-11.81-7.37-18.32-5.66-7.44 2-12.43 7.88-14.82 17.6-5.6 22.75-2 86.51 13.75 153.82 25.29 108.14 65.65 162.86 95.06 189.73 38 34.69 87.62 53.9 136.93 53.9a186 186 0 0027.77-2.04c41.71-6.32 76.43-27.27 96-57.75-89.49-23.28-165.94-67.55-242-139.16a16 16 0 01-.65-22.65zm306.08 142.19c-16.83-2.59-33.13-5.84-49-9.77a157.71 157.71 0 01-12.13 25.68c-.73 1.25-1.5 2.49-2.29 3.71a584.21 584.21 0 0058.56 12 16 16 0 104.87-31.62z"
        fill={`url(#${gradientId})`}
        strokeWidth="5"
        initial={{
          pathLength: isAnimated ? 0 : 1,
        }}
        animate={{
          pathLength: 1,
        }}
        transition={{
          duration: isAnimated ? duration * 0.5 : 0,
          delay: isAnimated ? delay : 0,
        }}
      />
    </svg>
  );
};

type LeafRatingMeanProps = BoxProps & {
  value: number;
  baseId: string;
  animationDuration?: number;
  containerAnimateProps?: MotionProps;
  iconSize?: string;
  initialDelay?: number;
  duration?: number;
  isAnimated?: boolean;
};

const LeafRatingMean = ({
  value,
  baseId,
  animationDuration = 5,
  containerAnimateProps,
  iconSize = "3em",
  initialDelay = 0,
  isAnimated = true,
}: LeafRatingMeanProps): JSX.Element => {
  const getFillPercentage = (index: number) => {
    const substraction = value - index;

    if (substraction > 1) return 100;
    if (substraction <= 0) return 0;
    const remainder = substraction % 1;
    return remainder !== 0 ? (substraction % 1) * 100 : 100;
  };

  const getAnimateDelay = (index: number) => {
    return (index * animationDuration) / 5 + initialDelay;
  };

  return (
    <BoxWithMotion display="flex" {...containerAnimateProps}>
      {[0, 1, 2, 3, 4].map((it) => (
        <Box key={it} position="relative" _notLast={{ mr: "2" }}>
          <MotionLeafIcon
            key={it}
            gradientId={`${baseId}-${it}`}
            delay={getAnimateDelay(it)}
            duration={animationDuration / 5}
            fillPercentage={getFillPercentage(it)}
            isAnimated={isAnimated}
            size={iconSize}
          />
        </Box>
      ))}
    </BoxWithMotion>
  );
};

export default LeafRatingMean;
