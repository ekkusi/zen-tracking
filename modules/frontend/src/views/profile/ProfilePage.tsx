import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ChallengeSelect, {
  OptionType,
  SelectHandle,
} from "../../components/functional/ChallengeSelect";
import Heading from "../../components/primitives/Heading";
import useGlobal from "../../store";
import { getParticipation } from "../../util/apolloQueries";
import SectionSeparator from "../../components/general/SectionSeparator";

const ProfilePage = (): JSX.Element => {
  const selectRef = useRef<SelectHandle>(null);
  const [getParticipationLoading, setGetParticipationLoading] = useState(false);

  const [activeParticipation, updateActiveParticipation] = useGlobal(
    (store) => store.activeParticipation,
    (actions) => actions.updateActiveParticipation
  );

  const onActiveChallengeSelect = async (value: OptionType | null) => {
    const selectedChallengeId = value?.value ?? null;
    if (selectedChallengeId) {
      setGetParticipationLoading(true);
      const result = await getParticipation({
        challengeId: selectedChallengeId,
      });
      updateActiveParticipation(result.data.getParticipation);
      setGetParticipationLoading(false);
    } else {
      updateActiveParticipation(null);
    }
  };

  return (
    <Box>
      <Heading.H1>
        Tähän tulloo yhen ukkelin ilmottautuminen ja muut tiedot
      </Heading.H1>
      <SectionSeparator title="Omat haasteet" />
      <Flex
        direction="column"
        alignItems={{ base: "left", sm: "center" }}
        mb="6"
      >
        <Heading.H3 fontWeight="normal" mb="2">
          Valitse aktiivinen haaste
        </Heading.H3>
        <ChallengeSelect
          initialValue={
            activeParticipation
              ? {
                  value: activeParticipation.challenge.id,
                  label: activeParticipation.challenge.name,
                }
              : undefined
          }
          onSelect={onActiveChallengeSelect}
          isLoading={getParticipationLoading}
          containerProps={{ mb: "2" }}
          ref={selectRef}
        />
        <Text as={Link} to="/" fontWeight="bold" fontSize="lg">
          Siirry merkkaamaan
          <ArrowForwardIcon />
        </Text>
      </Flex>
    </Box>
  );
};

export default ProfilePage;
