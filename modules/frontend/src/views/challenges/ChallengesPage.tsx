import React, { useMemo, useState } from "react";
import { Box, Icon, Text, useMediaQuery } from "@chakra-ui/react";
import Heading from "components/primitives/Heading";
import { useQuery } from "@apollo/client";
import EditChallenge from "components/functional/EditChallenge";
import { useHistory } from "react-router-dom";
import { OptionsType } from "react-select";
import { IoIosAdd } from "react-icons/io";
import ChallengesSection from "./ChallengesSection";
import Loading from "../../components/general/Loading";
import { GET_CHALLENGES } from "../../generalQueries";
import {
  GetChallenges,
  GetChallengesVariables,
} from "../../__generated__/GetChallenges";
import Select, { OptionType } from "../../components/general/Select";
import BackNavigationLink from "../../components/general/BackNavigationLink";
import useGlobal from "../../store";
import theme from "../../theme";

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
  const bottomNavBarState = useGlobal(
    (state) => state.bottomNavigationBarState
  )[0];

  const isMobileScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  )[0];

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
    setSort(selection.value);
  };

  return (
    <Box pb="5" position="relative">
      <BackNavigationLink to="/">Takaisin etusivulle</BackNavigationLink>
      <EditChallenge
        onEdit={async (challenge) => {
          await refetch();
          history.push(`/challenges/${challenge.id}`);
        }}
        openButtonProps={{
          position: "fixed",
          fontWeight: "normal",
          px: { base: 3, sm: 3 },
          py: { base: 3, sm: 3 },
          borderRadius: "50%",
          right: { base: 5, sm: 10, md: 14 },
          bottom: {
            base: bottomNavBarState === "visible" ? 20 : 5,
            sm: 10,
            md: 14,
          },
          zIndex: 101,
          css: {
            "> svg": {
              width: isMobileScreen ? 40 : 55,
              height: isMobileScreen ? 40 : 55,
              margin: 0,
            },
          },
        }}
        openButtonLabel={<Icon as={IoIosAdd} />}
      />
      <Heading.H1
        textAlign={{ base: "left", sm: "center" }}
        fontSize={{ base: "4xl", sm: "5xl" }}
        fontWeight="normal"
      >
        Haasteet
      </Heading.H1>
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
