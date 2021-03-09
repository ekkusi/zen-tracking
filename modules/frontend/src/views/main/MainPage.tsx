import { Box, Flex, Text } from "@chakra-ui/react";
import { ArrowForwardIcon, CheckIcon } from "@chakra-ui/icons";
import React from "react";
import { ButtonWithRef } from "components/primitives/Button";
import useGlobal from "store";
import Heading from "components/primitives/Heading";
import DateUtil from "util/DateUtil";
import { Link } from "react-router-dom";
import chakraMotionWrapper from "util/chakraMotionWrapper";
import { motion } from "framer-motion";
import MarkingCalendar from "../../components/MarkingCalendar";
import AddMarking from "../../components/EditMarking";

const MotionArrowForwardIcon = chakraMotionWrapper(ArrowForwardIcon);
const MotionButton = motion(ButtonWithRef);

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
  const [activeParticipation] = useGlobal((store) => store.activeParticipation);

  const hasUserMarkedToday = () => {
    return DateUtil.dateIsIn(
      new Date(),
      activeParticipation
        ? activeParticipation.markings.map((it) => new Date(it.date))
        : []
    );
  };

  return (
    <Box>
      <Heading.H1 mt="5">
        Tervehdys {user.name} ja tervetuloa seuraamaan zenisi kasvamista :){" "}
      </Heading.H1>

      {!activeParticipation ? (
        <>
          <Text>
            Et ole vielä liittynyt haasteisiin tai valinnut aktiivista
            haastetta. Pääset tutustumaan ja liittymään haasteisiin alta.
          </Text>
          <Flex justifyContent={{ base: "flex-start", sm: "center" }}>
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
              Haaasteisiin
            </MotionButton>
          </Flex>
        </>
      ) : (
        <>
          <Heading.H2 fontWeight="normal" mb={{ base: "6", md: "10" }}>
            <Text as="span" fontStyle="italic">
              Haasteesi:
            </Text>{" "}
            {activeParticipation.challenge.name}
          </Heading.H2>
          <Flex justifyContent={{ base: "flex-start", sm: "center" }} mb="7">
            <AddMarking
              openButtonLabel={
                hasUserMarkedToday()
                  ? "Olet jo merkannut tänään"
                  : "Merkkaa päivän suoritus"
              }
              openButtonProps={{
                isDisabled: hasUserMarkedToday(),
                size: "lg",
                leftIcon: (
                  <CheckIcon
                    w={{ base: 6, md: 8 }}
                    h={{ base: 6, md: 8 }}
                    mb="1px"
                  />
                ),
              }}
            />
          </Flex>
        </>
      )}
      <Box>
        {activeParticipation &&
          (activeParticipation.markings.length > 0 ? (
            <>
              <Heading.H2 mb="4" textAlign={{ base: "left", sm: "center" }}>
                Putkesi pituus:{" "}
                <Text as="span">
                  {DateUtil.getDateStreak(
                    activeParticipation.markings.map((it) => new Date(it.date))
                  )}{" "}
                </Text>
              </Heading.H2>
              <MarkingCalendar markings={activeParticipation.markings} />
            </>
          ) : (
            <>
              <Heading.H2 fontWeight="bold">
                Sinulla ei vielä ole merkkauksia.
              </Heading.H2>
              <Text>
                Aloita ensimmäisen merkkaaminen ylemmästä painikkeesta
                painamalla. Valikosta löydät tarvittaessa lisäohjeita.
              </Text>
            </>
          ))}
      </Box>
    </Box>
  );
};

export default MainPage;
