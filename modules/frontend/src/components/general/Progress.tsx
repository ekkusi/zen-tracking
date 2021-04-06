import { ProgressProps, Progress as ChakraProgress } from "@chakra-ui/react";
import React from "react";

type CustomProgressProps = ProgressProps & {
  animate?: boolean;
};

const Progress = ({ animate, ...rest }: CustomProgressProps): JSX.Element => {
  return <ChakraProgress height="32px" {...rest} />;
};

export default Progress;
