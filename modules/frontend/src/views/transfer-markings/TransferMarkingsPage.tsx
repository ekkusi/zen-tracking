import { useMutation, useQuery } from "@apollo/client";
import { Box, Container, Flex, Text } from "@chakra-ui/react";
import ChallengeSelect, {
  OptionType,
} from "components/functional/ChallengeSelect";
import EditChallenge from "components/functional/EditChallenge";
import CustomLoadingOverlay from "components/general/LoadingOverlay";
import { PrimaryButton } from "components/primitives/Button";
import Heading from "components/primitives/Heading";
import React, { useState, useMemo } from "react";

import useGlobal from "store";
import DateUtil from "util/DateUtil";
import UserInfoUtil from "util/UserInfoUtil";

import { getParticipation } from "../../util/apolloQueries";
import { GetChallenges_getChallenges } from "../../__generated__/GetChallenges";
import { GET_TRANSFERABLE_CHALLENGES, TRANSFER_MARKINGS } from "./queries";
import {
  GetTransferableChallenges,
  GetTransferableChallengesVariables,
} from "./__generated__/GetTransferableChallenges";
import {
  TransferMarkings,
  TransferMarkingsVariables,
} from "./__generated__/TransferMarkings";

const TransferMarkingsPage = (): JSX.Element => {
  const [activeParticipation, updateActiveParticipation] = useGlobal(
    (state) => state.activeParticipation,
    (actions) => actions.updateActiveParticipation
  );
  const [user, updateUser] = useGlobal(
    (store) => store.currentUser,
    (actions) => actions.updateUser
  );
  const [selectedChallengeId, setSelectedChallengeId] = useState<
    string | null
  >();
  const [error, setError] = useState<string>();

  const latestMarkingDate = useMemo((): Date | undefined => {
    if (activeParticipation && activeParticipation.markings.length > 0) {
      const latestMarking = UserInfoUtil.getLatestMarking(
        activeParticipation.markings
      );
      return latestMarking ? new Date(latestMarking.date) : undefined;
    }
    return undefined;
  }, [activeParticipation]);

  const earliestMarkingDate = useMemo((): Date | undefined => {
    if (activeParticipation && activeParticipation.markings.length > 0) {
      const earliestMarking = UserInfoUtil.getEarliestMarking(
        activeParticipation.markings
      );
      return earliestMarking ? new Date(earliestMarking.date) : undefined;
    }
    return undefined;
  }, [activeParticipation]);

  const { data, loading } = useQuery<
    GetTransferableChallenges,
    GetTransferableChallengesVariables
  >(GET_TRANSFERABLE_CHALLENGES, {
    variables: {
      startDate: {
        lte: earliestMarkingDate
          ? earliestMarkingDate.toISOString()
          : undefined,
      },
      endDate: {
        gte: latestMarkingDate ? latestMarkingDate.toISOString() : undefined,
      },
    },
  });

  const [transferUserMarkings] = useMutation<
    TransferMarkings,
    TransferMarkingsVariables
  >(TRANSFER_MARKINGS);

  const onChallengeSelect = async (value: OptionType | null) => {
    setSelectedChallengeId(value?.value || null);
  };

  const transferMarkings = async (challengeId: string | null) => {
    if (challengeId) {
      try {
        await transferUserMarkings({
          variables: {
            challengeId,
          },
        });
        const newParticipation = await getParticipation({
          challengeId,
          userName: user.name,
        });

        updateActiveParticipation(newParticipation.data.getParticipation);
      } catch (e) {
        setError(e.message);
      }
    } else setError("Valitse tai luo haaste ennen siirtämistä");
  };

  const mapOptions = (): OptionType[] => {
    return (
      data?.getChallenges.map((it) => {
        const dateString =
          it.startDate && it.endDate
            ? ` ${DateUtil.format(it.startDate)} - ${DateUtil.format(
                it.endDate
              )}`
            : "";
        return {
          value: it.id,
          label: `${it.name}${dateString}`,
        };
      }) || []
    );
  };

  const onChallengeCreated = async (challenge: GetChallenges_getChallenges) => {
    await transferMarkings(challenge.id);
  };

  return (
    <Container
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      py="5"
    >
      {loading ? (
        <CustomLoadingOverlay loadingText="Ladataan" />
      ) : (
        <Box>
          <Flex justifyContent="flex-end" mb="3">
            <PrimaryButton onClick={() => updateUser(null)}>
              Kirjaudu ulos
            </PrimaryButton>
          </Flex>

          <Heading.H1>Merkkausten siirto</Heading.H1>
          <Text>
            Tervehdys! Zen Tracking on muuttunut hieman sitten viime näkemäsi.
            Nyt uutena ominaisuutena sovellukseen on tullut <b>haasteet</b>!
          </Text>
          <Text mb="8">
            Tämän hienon uuden ominaisuuden johdosta zenin seuraamisen
            teknologiahärpäkepuoli vaatii, että sinun jokaisella merkkauksella
            pitää olla haaste. Tästä syystä sinun täytyy siirtää jo olemassa
            olevat merkkauksesi jollekin uudelle haasteelle. Valitse siis alta
            joko jo olemassa oleva haaste (mikäli semmoinen on) tai tutustu heti
            uuteen ominaisuuteen ja luo uusi haaste merkkauksillesi:)
          </Text>
          {data && data.getChallenges.length > 0 ? (
            <Flex direction="column" alignItems="center">
              <Heading.H3>Valitse haaste ja siirrä merkkaukset</Heading.H3>
              <ChallengeSelect
                isLoading={loading}
                options={mapOptions()}
                onSelect={onChallengeSelect}
                containerProps={{ mb: "4" }}
              />
              <PrimaryButton
                isDisabled={!selectedChallengeId}
                onClick={() => transferMarkings(selectedChallengeId || null)}
                mb="8"
              >
                Siirrä merkkaukset
              </PrimaryButton>
              <Text textAlign="center" fontWeight="bold" mb="8">
                TAI
              </Text>
            </Flex>
          ) : (
            <Text mb="3">
              Valmiita aktiivisia haasteita ei ole olemassa. Luo alta
              ensimmäinen ja siirrä merkkauksesi siihen!
            </Text>
          )}
          {error && <Text color="warning">{error}</Text>}
          <Flex justifyContent="center" mb="6">
            <EditChallenge
              onEdit={onChallengeCreated}
              openButtonLabel="Luo haaste ja siirrä"
              saveButtonLabel="Luo ja siirrä merkkaukset"
              openButtonProps={{ size: "lg" }}
              maxStartDate={earliestMarkingDate}
              minEndDate={latestMarkingDate}
              requireDates
            />
          </Flex>
          {latestMarkingDate && earliestMarkingDate && (
            <>
              <Text>
                <b>HUOM!</b> Ensimmäinen merkkauksesi oli päivälle{" "}
                <i>{DateUtil.format(earliestMarkingDate)}</i> ja viimeisesi
                päivälle <i>{DateUtil.format(latestMarkingDate)}</i>. Sinun
                täytyy luoda haaste tai valita sellainen haaste, joka kattaa
                kaikkien merkkauksiesi päivät.
              </Text>
              <Text>
                <b>HUOM 2!</b> Jos siirrät merkkaukset väärälle haasteelle,
                niitä ei tällä hetkellä voi itse siirtää tämän jälkeen toiseen.
                Jos siirrät vahingossa merkkaukset väärälle haasteelle, ota
                yhteyttä ekeukkoon:)
              </Text>
            </>
          )}
        </Box>
      )}
    </Container>
  );
};

export default TransferMarkingsPage;
