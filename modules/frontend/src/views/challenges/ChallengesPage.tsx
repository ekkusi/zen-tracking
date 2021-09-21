import React, { useMemo, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import { useQuery } from "@apollo/client";
import EditChallenge from "components/functional/EditChallenge";
import { Link, useHistory } from "react-router-dom";
import { OptionsType } from "react-select";
import ChallengesSection from "./ChallengesSection";
import Loading from "../../components/general/Loading";
import { GET_CHALLENGES } from "../../generalQueries";
import {
  GetChallenges,
  GetChallengesVariables,
} from "../../__generated__/GetChallenges";
import Select, { OptionType } from "../../components/general/Select";

const sortOptions: OptionsType<OptionType> = [
  {
    value: "newest_first",
    label: "Uusin ensin",
  },
  {
    value: "most_popular_first",
    label: "Suosituin ensin",
  },
];

const ChallengesPage = (): JSX.Element => {
  const [skip, setSkip] = useState(false);
  const [sort, setSort] = useState("newest_first");

  const history = useHistory();

  const { data, loading, error, refetch } = useQuery<
    GetChallenges,
    GetChallengesVariables
  >(
    GET_CHALLENGES,
    {
      skip,
    } // This stops looping useQuery when error is returned
  );

  if (error) {
    setSkip(true);
  }

  const sortedChallenges = useMemo(() => {
    if (data?.getChallenges) {
      const copy = [...data.getChallenges];
      return copy.sort((a, b) => {
        if (sort === "newest_first") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        return b.participations.length - a.participations.length;
      });
    }
    return [];
  }, [sort, data]);

  const onSortChange = (selection: OptionType) => {
    console.log("sort change", selection.value);
    setSort(selection.value);
  };

  return (
    <Box pb="5" position="relative">
      <Text as={Link} to="/" display={{ base: "none", sm: "inline-block" }}>
        Takaisin etusivulle
      </Text>
      <Heading.H1
        textAlign={{ base: "left", sm: "center" }}
        fontSize={{ base: "4xl", sm: "5xl" }}
        fontWeight="normal"
      >
        Haasteet
      </Heading.H1>
      <Text>
        Tällä sivulla löytyy tulevat ja menevät haasteet. Alta voit luoda oman
        haasteen halutessasi.
      </Text>
      <Flex justifyContent={{ base: "left", sm: "center" }} mb="5">
        <EditChallenge
          onEdit={async (challenge) => {
            await refetch();
            history.push(`/challenges/${challenge.id}`);
          }}
          openButtonProps={{ size: "lg" }}
        />
      </Flex>
      <Box mb="8">
        <Text>Järjestä haasteet</Text>
        <Select
          options={sortOptions}
          placeholder="Järjestä haasteet"
          defaultValue={sortOptions[0]}
          onChange={onSortChange}
        />
      </Box>
      {!loading && !error && (
        <Box>
          <ChallengesSection challenges={sortedChallenges} />
        </Box>
      )}
      {loading && <Loading />}
      {error && (
        <Text fontWeight="bold" color="warning">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default ChallengesPage;
