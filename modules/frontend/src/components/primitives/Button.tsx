import { Button, ButtonProps } from "@chakra-ui/react";
import styled from "styled-components";

const PrimaryButton = styled(Button)<ButtonProps>``;

const AlertButton = styled(Button)<ButtonProps>``;

const BaseButton: any = {
  textTransform: "uppercase",
  borderRadius: "sm",
  fontWeight: "bold",
  size: "md",
  fontSize: "xs",
  fontFamily: "body",
  _hover: {
    opacity: 1,
  },
  _disabled: {
    bg: "gray.200",
    color: "white",
    cursor: "not-allowed",
    opacity: 1,
    border: "none",
  },
};

PrimaryButton.defaultProps = {
  ...BaseButton,
  color: "white",
  bg: "primary.regular",
  variant: "solid",
  _hover: {
    bg: "secondary.regular",
  },
};

AlertButton.defaultProps = {
  ...BaseButton,
  color: "warning",
  background: "white",
  borderColor: "warning",
  variant: "outline",
  _hover: {
    color: "white",
    background: "warning",
  },
};

export { PrimaryButton, AlertButton };
