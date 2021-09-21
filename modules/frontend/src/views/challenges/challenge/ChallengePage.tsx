import { useQuery } from "@apollo/client";
import {
  Box,
  Grid,
  GridItem,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import React, { useMemo } from "react";

import { Link, useHistory, useParams } from "react-router-dom";
import Heading from "../../../components/primitives/Heading";
import useGlobal from "../../../store";
import { GET_CHALLENGE } from "./queries";
import {
  GetChallenge,
  GetChallengeVariables,
} from "./__generated__/GetChallenge";

import Loading from "../../../components/general/Loading";
import EditChallenge from "../../../components/functional/EditChallenge";
import EditParticipation from "../../../components/functional/EditParticipation";
import { getParticipationDateString } from "../../../util/challengeUtils";
import DateUtil from "../../../util/DateUtil";

const ChallengePage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const user = useGlobal((state) => state.currentUser)[0];

  const history = useHistory();

  const { data, loading, error, refetch } = useQuery<
    GetChallenge,
    GetChallengeVariables
  >(GET_CHALLENGE, {
    variables: {
      id,
    },
  });

  const challenge = useMemo(() => {
    return data?.getChallenge;
  }, [data]);

  const hasUserParticipated = () => {
    return challenge?.participations.some((it) => it.user.name === user.name);
  };

  const isUserChallengeCreator = () => {
    return challenge?.creator.name === user.name;
  };

  return (
    <Box>
      <Text
        as={Link}
        display="inline-block"
        to="/challenges"
        fontSize="lg"
        mb="3"
      >
        Takaisin haasteisiin
      </Text>

      {loading && <Loading />}
      {challenge && (
        <>
          <Heading.H1 textAlign={{ base: "left", sm: "center" }}>
            {challenge.name}
          </Heading.H1>
          <Grid
            mb="5"
            templateColumns={{
              base: "1fr",
              sm: "repeat(3, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            gap="2"
          >
            <GridItem as="span">
              <Text as="span" fontWeight="bold">
                Luotu:{" "}
              </Text>
              {DateUtil.format(challenge.createdAt)}
            </GridItem>
            <GridItem as="span">
              <Text as="span" fontWeight="bold">
                Tekijä:{" "}
              </Text>
              {challenge.creator.name}
            </GridItem>
            <GridItem as="span">
              <Text as="span" fontWeight="bold">
                Osallistujia:{" "}
              </Text>
              {challenge.participations.length}
            </GridItem>
          </Grid>
          <Heading.H2>Kuvaus</Heading.H2>
          <Text mb="5">{challenge.description}</Text>
          <Heading.H2>Osallistumiset</Heading.H2>
          {challenge.participations.length > 0 ? (
            <UnorderedList>
              {challenge.participations.map((it) => (
                <ListItem key={it.id}>
                  <Link to={`/profile/${it.user.name}/participations/${it.id}`}>
                    {it.user.name} {getParticipationDateString(it, "")}
                  </Link>
                </ListItem>
              ))}
            </UnorderedList>
          ) : (
            <Text>
              Kukaan ei ole vielä suorittanut haastetta. Ole ensimmäinen ja
              aloita haaste!
            </Text>
          )}

          <Box mt="5">
            <EditParticipation
              challenge={challenge}
              openButtonProps={{ mr: 4 }}
              openButtonLabel={
                hasUserParticipated() ? "Aloita uudelleen" : "Aloita haaste"
              }
              onEdit={() => {
                refetch();
              }}
            />
            {isUserChallengeCreator() && (
              <EditChallenge
                challenge={challenge}
                onEdit={() => {
                  refetch();
                }}
                onDelete={() => history.push("/challenges")}
                openButtonLabel="Muokkaa"
              />
            )}
          </Box>
        </>
      )}
      {!challenge && !loading && (
        <>
          <Heading.H1>Oho!</Heading.H1>
          <Text fontSize="xl"> Haastetta ei id:llä {id} löytynyt:(</Text>
          <Text>Ylhäältä pääset takaisin haasteiden selaamiseen.</Text>
        </>
      )}
      {error && (
        <Text fontWeight="bold" color="warning">
          {error.message}
        </Text>
      )}
    </Box>
  );
};

export default ChallengePage;
