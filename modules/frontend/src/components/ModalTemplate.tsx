import {
  ButtonProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  UseDisclosureProps,
} from "@chakra-ui/react";
import React from "react";
import { PrimaryButton } from "./primitives/Button";

type ModalTemplateProps = {
  openButtonLabel: string;
  headerLabel: string;
  children: JSX.Element;
  modalFooter?: JSX.Element;
  openButtonProps?: ButtonProps;
  closeButtonLabel?: string;
  disclosureProps?: UseDisclosureProps;
};

const ModalTemplate = ({
  openButtonProps,
  openButtonLabel,
  headerLabel,
  modalFooter,
  children,
  closeButtonLabel,
  disclosureProps,
}: ModalTemplateProps): JSX.Element => {
  const { isOpen, onClose, onOpen } = useDisclosure({ ...disclosureProps });

  return (
    <>
      <PrimaryButton onClick={onOpen} {...openButtonProps}>
        {openButtonLabel}
      </PrimaryButton>

      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{headerLabel}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>

          <ModalFooter>
            {modalFooter || (
              <PrimaryButton mr={3} onClick={onClose}>
                {closeButtonLabel}
              </PrimaryButton>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ModalTemplate.defaultProps = {
  openButtonProps: {},
  closeButtonLabel: "Sulje",
  modalFooter: null,
  disclosureProps: null,
};

export default ModalTemplate;
