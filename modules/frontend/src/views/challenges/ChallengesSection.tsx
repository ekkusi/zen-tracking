import { Box, BoxProps, Flex, Text } from "@chakra-ui/react";
import React from "react";
import ChallengeCard from "../../components/functional/ChallengeCard";
import SectionSeparator from "../../components/general/SectionSeparator";
import { GetChallenges_getChallenges } from "../../__generated__/GetChallenges";

type ChallengesSectionProps = BoxProps & {
  challenges: GetChallenges_getChallenges[];
  title?: string;
};

const ChallengesSection = ({
  challenges,
  title,
  ...rest
}: ChallengesSectionProps): JSX.Element => {
  return (
    <Box mb="6" {...rest}>
      {title && <SectionSeparator title={title} />}
      {challenges.length > 0 ? (
        <Flex wrap="wrap">
          {challenges.map((it) => (
            <ChallengeCard key={it.id} challenge={it} mr="3" mb="4" />
          ))}
        </Flex>
      ) : (
        <Text>Ei haasteita</Text>
      )}
    </Box>
  );
};

export default ChallengesSection;
