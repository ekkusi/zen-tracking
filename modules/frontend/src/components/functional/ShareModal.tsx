import {
  Button,
  Flex,
  Icon,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io5";
import { AiFillFacebook } from "react-icons/ai";
import ModalTemplate, { ModalTemplateProps } from "../general/ModalTemplate";

type ShareModalProps = Omit<ModalTemplateProps, "children" | "hasFooter"> & {
  link: string;
};

const ShareModal = ({ link, ...modalProps }: ShareModalProps): JSX.Element => {
  const [isCopied, setIsCopied] = useState(false);
  const disclosureProps = useDisclosure({
    onClose: () => {
      setIsCopied(false);
      if (modalProps.onClose) modalProps.onClose();
    },
  });

  return (
    <ModalTemplate
      headerLabel="Jaa sivu"
      hasFooter={false}
      {...modalProps}
      {...disclosureProps}
    >
      <>
        <Text mb="0">Jaa eri kanavissa:</Text>
        <Flex py="2">
          <Text
            as="a"
            href={`whatsapp://send?text=${link}`}
            aria-label="Share to Whatsapp"
            mr="2"
          >
            <Icon as={IoLogoWhatsapp} w={10} h={10} />
          </Text>
          <Text
            as="a"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
              "https://google.com"
            )}`}
            target="_blank"
          >
            <Icon as={AiFillFacebook} w={10} h={10} />
          </Text>
        </Flex>
        <Text>Tai kopioi linkki</Text>
        <Flex alignItems="stretch">
          <Input
            value={link}
            height="auto"
            borderBottomRightRadius="none"
            borderTopRightRadius="none"
            borderRight="none"
          />
          <Button
            isDisabled={isCopied}
            size="md"
            onClick={() => {
              navigator.clipboard.writeText(link);
              setIsCopied(true);
            }}
            borderTopLeftRadius="none"
            borderBottomLeftRadius="none"
          >
            {isCopied ? "Kopioitu" : "Kopioi"}
          </Button>
        </Flex>
      </>
    </ModalTemplate>
  );
};

export default ShareModal;
