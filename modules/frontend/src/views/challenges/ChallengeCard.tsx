import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { PrimaryButton } from "components/primitives/Button";
import Heading from "components/primitives/Heading";
import React from "react";
import { GetChallengesQuery_getChallenges } from "./__generated__/GetChallengesQuery";

type ChallengeCardProps = FlexProps & {
  challenge: GetChallengesQuery_getChallenges;
};

const ChallengeCard = ({
  challenge,
  ...rest
}: ChallengeCardProps): JSX.Element => {
  return (
    <Flex
      direction="column"
      borderRadius="10px"
      boxShadow="base"
      width={{ base: "100%", sm: "300px" }}
      height="300px"
      py="5"
      px="7"
      {...rest}
    >
      <Heading.H3 mb="0">{challenge.name}</Heading.H3>
      <Text as="span" mb="2">
        Ilmoittautuneita: {challenge.participations.length}
      </Text>
      <Text fontSize="md" overflow="hidden">
        {challenge.description}
      </Text>
      <PrimaryButton
        size="xs"
        onClick={() => alert(`Opening challenge ${challenge.name}`)}
        mb="2"
        mt="auto"
      >
        Ilmoittaudu
      </PrimaryButton>
    </Flex>
  );
};

export default ChallengeCard;
