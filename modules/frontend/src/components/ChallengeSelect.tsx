import { useQuery } from "@apollo/client";
import { Box, BoxProps, Text } from "@chakra-ui/react";
import { GET_USER_PARTICIPATIONS_PLAIN } from "generalQueries";
import React, { forwardRef, useImperativeHandle } from "react";

import Select, { OptionsType } from "react-select";
import useGlobal from "store";
import {
  GetUserParticipationsPlainQuery,
  GetUserParticipationsPlainQueryVariables,
} from "__generated__/GetUserParticipationsPlainQuery";

type ChallengeSelectProps = {
  initialValue?: OptionType;
  onSelect: (value: OptionType | null) => Promise<void> | void;
  isLoading?: boolean;
  containerProps?: BoxProps;
  options?: OptionsType<OptionType>;
};

export type OptionType = {
  value: string;
  label: string;
};

export type SelectHandle = {
  refetchOptions: () => void;
};

const ChallengeSelect = forwardRef(
  (
    {
      initialValue,
      isLoading,
      onSelect,
      containerProps,
      options,
    }: ChallengeSelectProps,
    ref
  ): JSX.Element => {
    const user = useGlobal((state) => state.currentUser)[0];

    const { data, loading, error, refetch } = useQuery<
      GetUserParticipationsPlainQuery,
      GetUserParticipationsPlainQueryVariables
    >(GET_USER_PARTICIPATIONS_PLAIN, {
      variables: {
        userName: user.name,
      },
      fetchPolicy: "no-cache",
    });

    const mapOptions = (): OptionsType<OptionType> | undefined => {
      return data?.getUserParticipations.map((it) => ({
        value: it.challenge.id,
        label: it.challenge.name,
      }));
    };

    const onChange = (selectedValue: OptionType | null) => {
      onSelect(selectedValue);
    };

    useImperativeHandle(ref, () => ({
      refetchOptions() {
        refetch();
      },
    }));

    return (
      <Box width={{ base: "auto", sm: "400px" }} {...containerProps}>
        <Select
          isLoading={loading || isLoading}
          isDisabled={loading || isLoading}
          defaultValue={initialValue}
          options={options || mapOptions()}
          onChange={onChange}
          noOptionsMessage={() => "Ei valittavia haasteita, liity haasteeseen"}
        />
        {error && <Text color="warning">{error}</Text>}
      </Box>
    );
  }
);

export default ChallengeSelect;
