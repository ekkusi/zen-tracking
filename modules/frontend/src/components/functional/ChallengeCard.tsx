import {
  Flex,
  FlexProps,
  LightMode,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { ButtonWithRef } from "components/primitives/Button";
import Heading from "components/primitives/Heading";
import React from "react";
import DateUtil from "util/DateUtil";
import { Link } from "react-router-dom";
import { GetChallenges_getChallenges } from "../../__generated__/GetChallenges";
import useGlobal from "../../store";

type ChallengeCardProps = FlexProps & {
  challenge: GetChallenges_getChallenges;
  openButtonLabel?: string;
};

const ChallengeCard = ({
  challenge,
  openButtonLabel = "Lue lisää",
  ...rest
}: ChallengeCardProps): JSX.Element => {
  const { colorMode } = useColorMode();
  const user = useGlobal((state) => state.currentUser)[0];

  return (
    <Flex
      direction="column"
      borderRadius="10px"
      boxShadow={colorMode === "light" ? "dark" : "dark-lg"}
      width={{ base: "100%", sm: "300px" }}
      height="300px"
      py="5"
      px="7"
      bg={colorMode === "light" ? "white" : "gray.50"}
      color="text.light"
      {...rest}
    >
      <LightMode>
        <Heading.H3 mb="0">{challenge.name}</Heading.H3>
        <Text as="span" fontStyle="italic" mb="0">
          {challenge.startDate && challenge.endDate
            ? `${DateUtil.format(challenge.startDate)} -
            ${DateUtil.format(challenge.endDate)}`
            : "Ei päätettyä ajankohtaa"}
        </Text>
        <Text as="span">
          Tekijä:{" "}
          {challenge.creator.name === user.name
            ? "Sinä"
            : challenge.creator.name}
        </Text>
        <Text as="span" mb="3">
          Osallistujia: {challenge.participations.length}
        </Text>

        <Text fontSize="md" overflow="hidden">
          {challenge.description}
        </Text>
      </LightMode>

      <ButtonWithRef as={Link} to={`/challenges/${challenge.id}`} mt="auto">
        {openButtonLabel}
      </ButtonWithRef>
    </Flex>
  );
};

export default ChallengeCard;
