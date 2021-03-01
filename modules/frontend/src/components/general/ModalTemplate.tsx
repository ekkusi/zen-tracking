import {
  ButtonProps,
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  ModalFooter,
  ModalFooterProps,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  useDisclosure,
} from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import React from "react";
import { PrimaryButton } from "../primitives/Button";

export type ModalTemplateProps = Omit<
  ModalProps,
  "children" | "isOpen" | "onClose" | "onOpen"
> & {
  children: JSX.Element;
  hasOpenButton?: boolean;
  hasHeader?: boolean;
  hasFooter?: boolean;
  openButtonLabel?: string;
  headerLabel?: string;
  modalFooter?: JSX.Element;
  openButtonProps?: ButtonProps;
  closeButtonLabel?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  modalBodyProps?: ModalBodyProps;
  modalContentProps?: ModalContentProps;
  modalFooterProps?: ModalFooterProps;
};

const ModalTemplate = ({
  children,
  hasOpenButton = true,
  hasHeader = true,
  hasFooter = true,
  openButtonProps = {},
  openButtonLabel = "Avaa modal",
  headerLabel = "Modal",
  closeButtonLabel = "Sulje",
  isOpen: customIsOpen,
  onOpen: customOnOpen,
  onClose: customOnClose,
  modalFooter,
  modalContentProps,
  modalBodyProps,
  modalFooterProps,
  ...rest
}: ModalTemplateProps): JSX.Element => {
  const { isOpen, onClose, onOpen } = useDisclosure({
    isOpen: customIsOpen,
    onOpen: customOnOpen,
    onClose: customOnClose,
  });

  return (
    <>
      {hasOpenButton && (
        <PrimaryButton onClick={onOpen} {...openButtonProps}>
          {openButtonLabel}
        </PrimaryButton>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        autoFocus={false}
        {...rest}
      >
        <ModalOverlay />
        <ModalContent {...modalContentProps}>
          {hasHeader && (
            <ModalHeader pr="10">
              <Heading.H2 mb="0" fontWeight="bold">
                {headerLabel}
              </Heading.H2>
            </ModalHeader>
          )}
          <ModalCloseButton />
          <ModalBody {...modalBodyProps}>{children}</ModalBody>

          {hasFooter && (
            <ModalFooter {...modalFooterProps}>
              {modalFooter || (
                <PrimaryButton mr={3} onClick={onClose}>
                  {closeButtonLabel}
                </PrimaryButton>
              )}
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalTemplate;
