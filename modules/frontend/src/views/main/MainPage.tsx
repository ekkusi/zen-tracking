import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ArrowForwardIcon, CheckIcon } from "@chakra-ui/icons";
import React, { useRef, useState } from "react";
import useGlobal from "store";
import Heading from "components/primitives/Heading";
import DateUtil from "util/DateUtil";
import { Link } from "react-router-dom";
import chakraMotionWrapper from "util/chakraMotionWrapper";
import { motion } from "framer-motion";
import ChallengeSelect, {
  OptionType,
  SelectHandle,
} from "components/functional/ChallengeSelect";
import CustomLoadingOverlay from "components/general/LoadingOverlay";
import EditMarking from "../../components/functional/EditMarking";
import MarkingCalendar from "../../components/functional/MarkingCalendar";
import { getParticipation } from "../../util/apolloQueries";
import { ChallengeStatus } from "../../__generated__/globalTypes";

const MotionArrowForwardIcon = chakraMotionWrapper(ArrowForwardIcon);
const MotionButton = motion(Button);

const iconHoverVariants = {
  rest: {
    x: 0,
  },
  hover: {
    x: 7,
  },
};

const MainPage = (): JSX.Element => {
  const user = useGlobal((store) => store.currentUser)[0];
  const [loading, setLoading] = useState(false);
  const [activeParticipation, updateActiveParticipation] = useGlobal(
    (store) => store.activeParticipation,
    (actions) => actions.updateActiveParticipation
  );

  const selectRef = useRef<SelectHandle>(null);

  const hasUserMarkedToday = () => {
    return DateUtil.dateIsIn(
      new Date(),
      activeParticipation
        ? activeParticipation.markings.map((it) => new Date(it.date))
        : []
    );
  };

  const onActiveChallengeSelect = async (value: OptionType | null) => {
    const selectedChallengeId = value?.value ?? null;
    if (selectedChallengeId) {
      setLoading(true);
      const result = await getParticipation({
        challengeId: selectedChallengeId,
        userName: user.name,
      });
      updateActiveParticipation(result.data.getParticipation ?? null);
      setLoading(false);
    } else {
      updateActiveParticipation(null);
    }
  };

  return (
    <Box>
      <Heading.H1 mt={{ base: 0, sm: 5 }}>
        Tervehdys {user.name}! :){" "}
      </Heading.H1>

      {!activeParticipation ? (
        <>
          <Text mb="10">
            Et ole vielä liittynyt haasteisiin tai valinnut aktiivista
            haastetta. Pääset tutustumaan ja liittymään haasteisiin alta.
          </Text>
          <Flex justifyContent="center">
            <MotionButton
              size="lg"
              as={Link}
              to="/challenges"
              initial="rest"
              whileHover="hover"
              rightIcon={
                <MotionArrowForwardIcon
                  size="xl"
                  w={6}
                  h={6}
                  variants={iconHoverVariants}
                />
              }
            >
              Haasteisiin
            </MotionButton>
          </Flex>
        </>
      ) : (
        <>
          <Heading.H3 fontWeight="normal" mb="2">
            Aktiivinen haaste
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
            isLoading={loading}
            containerProps={{ mb: "2" }}
            ref={selectRef}
          />
          <Text
            as={Link}
            to="/challenges"
            display="inline-block"
            mb={{ base: "6", md: "10" }}
            fontSize="xl"
          >
            Selaa muita haasteita
          </Text>
          {activeParticipation.challenge.status === ChallengeStatus.ACTIVE && (
            <Flex direction="column" alignItems="center" mb="7">
              <EditMarking
                openButtonLabel={
                  hasUserMarkedToday()
                    ? "Olet jo merkannut tänään"
                    : "Merkkaa päivän suoritus"
                }
                openButtonProps={{
                  isDisabled: hasUserMarkedToday() || loading,
                  size: "lg",
                  leftIcon: (
                    <CheckIcon
                      w={{ base: 6, md: 8 }}
                      h={{ base: 6, md: 8 }}
                      mb="1px"
                    />
                  ),
                  mb: 1,
                }}
              />
              <Text
                as={Link}
                to={`/profile/${user.name}/${activeParticipation.challenge.id}`}
                fontSize="xl"
              >
                Tarkastele koko suoritusta
              </Text>
            </Flex>
          )}
        </>
      )}

      <Box>
        {loading && <CustomLoadingOverlay />}
        {activeParticipation && (
          <MarkingCalendar participation={activeParticipation} />
        )}
      </Box>
    </Box>
  );
};

export default MainPage;
