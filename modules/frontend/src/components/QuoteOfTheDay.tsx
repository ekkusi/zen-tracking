import { ButtonProps, Icon, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import ImageModal from "./general/ImageModal";
import { PrimaryButton } from "./primitives/Button";
import config from "../config.json";

type QuoteOfTheDayProps = {
  openButtonProps?: Omit<ButtonProps, "onClick">;
};

const QuoteOfTheDay = ({
  openButtonProps,
}: QuoteOfTheDayProps): JSX.Element => {
  const [quoteOfTheDayUrl, setQuoteOfTheDayUrl] = useState<string>();

  const quoteCreditsUrl = "https://www.instagram.com/motivaatiolauseet/";

  const openQuoteOfTheDay = () => {
    setQuoteOfTheDayUrl(
      `${config.QUOTE_PHOTOS_BASE_URL}/quote-${Math.ceil(
        Math.random() * config.NUMBER_OF_QUOTE_PHOTOS
      )}.jpg`
    );
  };
  return (
    <>
      <PrimaryButton
        variant="outline"
        onClick={openQuoteOfTheDay}
        {...openButtonProps}
      >
        Quote of the Day
      </PrimaryButton>
      <ImageModal
        isOpen={!!quoteOfTheDayUrl}
        onClose={() => setQuoteOfTheDayUrl(undefined)}
        src={quoteOfTheDayUrl}
        alt={quoteOfTheDayUrl}
        boxSize="100%"
        imgText={
          <>
            <Text as="a" color="white" target="_blank" href={quoteCreditsUrl}>
              <Icon as={FaInstagram} mb="2px" mr="1" />
              motivaatiolauseet
            </Text>
          </>
        }
      />
    </>
  );
};

export default QuoteOfTheDay;
