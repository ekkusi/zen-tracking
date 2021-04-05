import {
  Button,
  Flex,
  FlexProps,
  LightMode,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import React from "react";
import DateUtil from "util/DateUtil";
import { Link, useHistory } from "react-router-dom";
import { GetChallenges_getChallenges } from "../../__generated__/GetChallenges";
import useGlobal from "../../store";
import chakraMotionWrapper from "../../util/chakraMotionWrapper";

type ChallengeCardProps = FlexProps & {
  challenge: GetChallenges_getChallenges;
  openButtonLabel?: string;
  isLink?: boolean;
};

const FlexWithMotion = chakraMotionWrapper(Flex);

const ChallengeCard = ({
  challenge,
  openButtonLabel = "Lue lisää",
  isLink = true,
  ...rest
}: ChallengeCardProps): JSX.Element => {
  const { colorMode } = useColorMode();
  const user = useGlobal((state) => state.currentUser)[0];

  const history = useHistory();

  return (
    <FlexWithMotion
      as={isLink ? Link : undefined}
      to={`/challenges/${challenge.id}`}
      direction="column"
      borderRadius="10px"
      boxShadow={colorMode === "light" ? "dark" : "dark-lg"}
      width={{ base: "100%", sm: "300px" }}
      height="300px"
      py="5"
      px="7"
      bg={colorMode === "light" ? "white" : "gray.50"}
      color="text.light"
      _hover={{
        opacity: 1,
      }}
      whileHover={{
        scale: isLink ? 1.05 : 1.0,
      }}
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

      <Button
        onClick={() => history.push(`/challenges/${challenge.id}`)}
        mt="auto"
      >
        {openButtonLabel}
      </Button>
    </FlexWithMotion>
  );
};

export default ChallengeCard;
