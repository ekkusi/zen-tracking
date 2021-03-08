import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { FaInstagram } from "react-icons/fa";
import React, { useState } from "react";
import { PrimaryButton } from "components/primitives/Button";
import ModalTemplate from "components/general/ModalTemplate";
import useGlobal from "store";
import Heading from "components/primitives/Heading";
import DateUtil from "util/DateUtil";
import ImageModal from "components/general/ImageModal";
import { Link } from "react-router-dom";
import MarkingCalendar from "../../components/MarkingCalendar";
import AddMarking from "../../components/EditMarking";

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
      <Heading.H2 fontWeight="normal" mb={{ base: "6", md: "10" }}>
        <Text as="span" fontStyle="italic">
          Maaliskuun haaste:
        </Text>{" "}
        mikä haaste onkaan mielessä:) Kohta tullee mahollisuus tehä oma haaste!
      </Heading.H2>
      {!activeParticipation ? (
        <Text>
          Valitse haaste merkataksesi suoritus. Jos et ole liittynyt
          haasteeseen, pääset tutustumaan ja liittymään haasteisiin{" "}
          <Link to="/challenges">täältä.</Link>
        </Text>
      ) : (
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
      )}
      <Box>
        {activeParticipation && activeParticipation.markings.length > 0 ? (
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
            <Text fontSize="lg">
              Aloita ensimmäisen merkkaaminen ylemmästä painikkeesta painamalla.
              Ylhäältä löydät tarvittaessa lisäohjeita.
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
};

export default MainPage;
