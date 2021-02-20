import {
  ButtonProps,
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  UseDisclosureProps,
} from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import React from "react";
import { PrimaryButton } from "../primitives/Button";

export type ModalTemplateProps = {
  children: JSX.Element;
  hasOpenButton?: boolean;
  openButtonLabel?: string;
  headerLabel?: string;
  modalFooter?: JSX.Element;
  openButtonProps?: ButtonProps;
  closeButtonLabel?: string;
  disclosureProps?: UseDisclosureProps;
  modalBodyProps?: ModalBodyProps;
};

const ModalTemplate = ({
  hasOpenButton,
  openButtonProps,
  openButtonLabel,
  headerLabel,
  modalFooter,
  children,
  closeButtonLabel,
  disclosureProps,
  modalBodyProps,
}: ModalTemplateProps): JSX.Element => {
  const { isOpen, onClose, onOpen } = useDisclosure({ ...disclosureProps });

  return (
    <>
      {hasOpenButton && (
        <PrimaryButton onClick={onOpen} {...openButtonProps}>
          {openButtonLabel}
        </PrimaryButton>
      )}

      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading.H2 mb="0" fontWeight="bold">
              {headerLabel}
            </Heading.H2>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody {...modalBodyProps}>{children}</ModalBody>

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
  hasOpenButton: true,
  openButtonLabel: "Avaa modal",
  headerLabel: "Modal",
  openButtonProps: {},
  closeButtonLabel: "Sulje",
  modalFooter: null,
  disclosureProps: null,
  modalBodyProps: {},
};

export default ModalTemplate;
