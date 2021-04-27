import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useRef, useState, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import ChallengeSelect, {
  OptionType,
  SelectHandle,
} from "../../components/functional/ChallengeSelect";
import Heading from "../../components/primitives/Heading";
import useGlobal from "../../store";
import { getParticipation } from "../../util/apolloQueries";
import SectionSeparator from "../../components/general/SectionSeparator";
import ChallengeCard from "../../components/functional/ChallengeCard";
import { GET_USER_WITH_PARTICIPATIONS } from "./queries";
import Loading from "../../components/general/Loading";
import {
  GetUserWithParticipations,
  GetUserWithParticipationsVariables,
} from "./__generated__/GetUserWithParticipations";
import DateUtil from "../../util/DateUtil";
import { LinkList, LinkListItem } from "../../components/general/LinkList";
import UserInfoUtil from "../../util/UserInfoUtil";
import {
  GetChallenges,
  GetChallengesVariables,
} from "../../__generated__/GetChallenges";
import { GET_CHALLENGES } from "../../generalQueries";
import UserEditModal from "../../components/functional/UserEditModal";

const ProfilePage = (): JSX.Element => {
  const { userName } = useParams<{ userName: string }>();

  const selectRef = useRef<SelectHandle>(null);
  const [getParticipationLoading, setGetParticipationLoading] = useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);

  const [activeParticipation, updateActiveParticipation] = useGlobal(
    (store) => store.activeParticipation,
    (actions) => actions.updateActiveParticipation
  );

  const currentUser = useGlobal((state) => state.currentUser)[0];

  const setHideNavigation = useGlobal(
    () => {},
    (actions) => actions.setHideNavigation
  )[1];

  const history = useHistory();

  const { data: userChallengesData, loading: userChallengesLoading } = useQuery<
    GetChallenges,
    GetChallengesVariables
  >(GET_CHALLENGES, {
    variables: {
      creatorName: userName,
    },
  });

  const {
    data: userWithParticipationsData,
    loading: userWithParticipationsLoading,
  } = useQuery<GetUserWithParticipations, GetUserWithParticipationsVariables>(
    GET_USER_WITH_PARTICIPATIONS,
    {
      variables: {
        userName,
      },
    }
  );

  const createdChallenges = useMemo(() => {
    return userChallengesData?.getChallenges;
  }, [userChallengesData]);

  const user = useMemo(() => {
    return userWithParticipationsData?.getUser;
  }, [userWithParticipationsData]);

  const isCurrentUser = () => {
    return userName === currentUser.name;
  };

  const participations = useMemo(() => {
    if (!user || user.participations.length === 0) return [];
    let sortedParticipations = UserInfoUtil.sortParticipations(
      user.participations,
      activeParticipation
    );
    if (user.name === userName) {
      sortedParticipations = sortedParticipations.filter(
        (it) => it.id !== activeParticipation?.id
      );
    }
    return sortedParticipations;
  }, [user, activeParticipation, userName]);

  const onActiveChallengeSelect = async (value: OptionType | null) => {
    const selectedChallengeId = value?.value ?? null;
    if (selectedChallengeId) {
      setGetParticipationLoading(true);
      const result = await getParticipation({
        challengeId: selectedChallengeId,
        userName: currentUser.name,
      });
      updateActiveParticipation(result.data.getParticipation);
      setGetParticipationLoading(false);
    } else {
      updateActiveParticipation(null);
    }
  };

  return (
    <Box>
      {isCurrentUser() && (
        <>
          <UserEditModal
            hasOpenButton={false}
            isOpen={isUserEditModalOpen}
            onClose={() => setIsUserEditModalOpen(false)}
            onEdit={(editedUser) => history.push(`/profile/${editedUser.name}`)}
            user={currentUser}
          />
          <Button as="a" onClick={() => setIsUserEditModalOpen(true)} mb="5">
            Muokkaa tietojasi
          </Button>
        </>
      )}
      <SectionSeparator
        mt="5"
        title={
          isCurrentUser()
            ? "Osallistumisesi"
            : `Käyttäjän ${userName} osallistumiset`
        }
      />
      {isCurrentUser() && (
        <Flex
          direction="column"
          alignItems={{ base: "left", sm: "center" }}
          mb="6"
        >
          <Heading.H3 fontWeight="normal" mb="2">
            Nykyinen aktiivinen haaste
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
          {activeParticipation && (
            <Text
              onClick={() => {
                setHideNavigation(true);
                history.push(
                  `/profile/${userName}/${activeParticipation.challenge.id}`
                );
              }}
              as="a"
              fontWeight="bold"
              fontSize="lg"
            >
              Tarkastele suorituksen kulkua
              <ArrowForwardIcon />
            </Text>
          )}
        </Flex>
      )}
      {userWithParticipationsLoading && <Loading />}
      {participations.length > 0 ? (
        <>
          {isCurrentUser() && (
            <Heading.H3 mb={{ base: "3", sm: "2" }}>
              Muut osallistumisesi
            </Heading.H3>
          )}
          <LinkList>
            {participations.map((it) => (
              <LinkListItem
                to={`/profile/${userName}/${it.challenge.id}`}
                position="relative"
                pr="10"
                key={it.id}
              >
                <Text as="span" fontSize={{ base: "md", md: "lg" }} mr="2">
                  {it.challenge.name}
                </Text>
                {it.challenge.startDate && it.challenge.endDate && (
                  <Text
                    as="span"
                    display="inline-block"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    {DateUtil.format(it.challenge.startDate)} -{" "}
                    {DateUtil.format(it.challenge.endDate)}
                  </Text>
                )}
                <ArrowForwardIcon
                  position="absolute"
                  right="10px"
                  top="54%"
                  transform="translateY(-50%)"
                  w={5}
                  h={5}
                />
              </LinkListItem>
            ))}
          </LinkList>
        </>
      ) : (
        <>
          <Text>
            {isCurrentUser()
              ? "Sinulla ei vielä ole osallistumisia. Alta pääset haasteisiin, jossa voit ilmoittautua johonkin haasteeseen tai luoda oman!"
              : `Käyttäjällä ${userName} ei vielä ole julkisia osallistumisia.`}
          </Text>
          {isCurrentUser() && (
            <Flex justify="center">
              <Button as={Link} to="/challenges" size="lg">
                Haasteisiin
              </Button>
            </Flex>
          )}
        </>
      )}

      <SectionSeparator
        title={
          isCurrentUser()
            ? "Omat haasteet"
            : `Käyttäjän ${userName} luomat haasteet`
        }
      />
      {userChallengesLoading && <Loading />}
      {createdChallenges && createdChallenges.length > 0 ? (
        <Flex wrap="wrap">
          {createdChallenges.map((it) => (
            <ChallengeCard
              key={it.id}
              challenge={it}
              mr="3"
              mb="4"
              openButtonLabel={
                isCurrentUser() ? "Lue lisää ja muokkaa" : "Lue lisää"
              }
            />
          ))}
        </Flex>
      ) : (
        <Text>Et ole vielä luonut haasteita</Text>
      )}
    </Box>
  );
};

export default ProfilePage;
