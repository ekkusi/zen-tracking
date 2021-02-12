import { Input, InputProps, Textarea } from "@chakra-ui/react";
import styled, { css } from "styled-components/macro";

export type PrimaryInputProps = InputProps & {
  isHighlighted?: boolean;
  isOverlined?: boolean;
  hasError?: boolean;
};

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
  ${({ isHighlighted, theme }) =>
    isHighlighted &&
    css`
      &&,
      &&:focus,
      &&:hover,
      &&:read-only,
      &&:disabled {
        background: ${theme.colors.teal[50]};
        border-color: ${theme.colors.primary.regular};
        border-width: 1px;
        &:focus {
          border-width: 2px;
        }
      }
    `}
${({ isOverlined, theme }) =>
    isOverlined &&
    css`
      &&,
      &&:focus,
      &&:hover,
      &&:read-only,
      &&:disabled {
        color: ${theme.colors.warning};
        text-decoration: line-through;
      }
    `}

${({ hasError, theme }) =>
    hasError &&
    css`
      &&,
      &&:focus,
      &&:hover,
      &&:read-only,
      &&:disabled {
        color: ${theme.colors.black};
        border-color: ${theme.colors.warning};
        background-color: ${theme.colors.red[50]};
        text-decoration: none;
        border-width: 1px;
        &:focus {
          border-width: 2px;
        }
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
  borderRadius: "sm",
};

PrimaryInput.defaultProps = {
  ...baseInputProps,
  _focus: {
    bg: "teal.50",
    borderColor: "primary.regular",
    borderWidth: "2px",
  },
  _readOnly: {
    opacity: 1,
    pointerEvents: "none",
  },
};

PrimaryTextArea.defaultProps = {
  ...baseInputProps,
  _focus: {
    bg: "teal.50",
    borderColor: "primary.regular",
    borderWidth: "2px",
  },
  _readOnly: {
    opacity: 1,
    pointerEvents: "none",
  },
};

export { PrimaryInput, PrimaryTextArea };
