import { Input, InputProps, Textarea } from "@chakra-ui/react";
import styled, { css } from "styled-components/macro";

export type PrimaryInputProps = InputProps & {};

const customInputCss = css<PrimaryInputProps>`
  ${({ isReadOnly, theme }) =>
    isReadOnly &&
    css`
      &&,
      &&:focus,
      &&:hover,
      &&:read-only,
      &&:disabled {
        background-color: ${theme.colors.gray[50]};
      }
    `}
`;

const PrimaryInput = styled(Input)<PrimaryInputProps>`
  ${customInputCss}
`;

const PrimaryTextArea = styled(Textarea)<PrimaryInputProps>`
  ${customInputCss}
`;

const baseInputProps: InputProps = {
  fontSize: "sm",
  borderRadius: "5px",
  _invalid: {
    borderColor: "warning",
    _focus: {
      borderColor: "warning",
    },
  },
  _disabled: {
    bg: "secondary.light",
    pointerEvents: "none",
  },
  _readOnly: {
    opacity: 1,
    pointerEvents: "none",
  },
};

PrimaryInput.defaultProps = {
  ...baseInputProps,
  _focus: {
    borderColor: "primary.regular",
  },
};

PrimaryTextArea.defaultProps = {
  ...baseInputProps,
  _focus: {
    borderColor: "primary.regular",
  },
};

export { PrimaryInput, PrimaryTextArea };
