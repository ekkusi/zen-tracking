import { Box, BoxProps, Flex, Text } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import React from "react";
import ChallengeCard from "./ChallengeCard";
import { GetChallenges_getChallenges } from "./__generated__/GetChallenges";

type ChallengesSectionProps = BoxProps & {
  challenges: GetChallenges_getChallenges[];
  updateChallenges: () => Promise<void>;
  title?: string;
};

const ChallengesSection = ({
  challenges,
  title,
  updateChallenges,
  ...rest
}: ChallengesSectionProps): JSX.Element => {
  return (
    <Box mb="6" {...rest}>
      {title && <Heading.H3>{title}</Heading.H3>}
      {challenges.length > 0 ? (
        <Flex wrap="wrap">
          {challenges.map((it) => (
            <ChallengeCard
              key={it.id}
              updateChallenges={updateChallenges}
              challenge={it}
              mr="3"
              mb="4"
            />
          ))}
        </Flex>
      ) : (
        <Text>Ei haasteita</Text>
      )}
    </Box>
  );
};

export default ChallengesSection;
