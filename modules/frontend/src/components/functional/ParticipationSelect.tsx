import { useQuery } from "@apollo/client";
import { Box, BoxProps, Text } from "@chakra-ui/react";
import { GET_PARTICIPATIONS_PLAIN } from "generalQueries";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  useEffect,
} from "react";

import { OptionsType } from "react-select";
import useGlobal from "store";
import {
  GetParticipationsPlain,
  GetParticipationsPlainVariables,
} from "../../__generated__/GetParticipationsPlain";
import Select from "../general/Select";

type ParticipationSelectProps = {
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
  nullValue: (value: OptionType | null) => void;
};

const currentDate = new Date();

const ParticipationSelect = forwardRef(
  (
    {
      initialValue,
      isLoading,
      onSelect,
      containerProps,
      options,
    }: ParticipationSelectProps,
    ref
  ): JSX.Element => {
    const [value, setValue] = useState<OptionType | null>();
    const user = useGlobal((state) => state.currentUser)[0];
    const activeParticipation = useGlobal(
      (state) => state.activeParticipation
    )[0];

    const { data, loading, error, refetch } = useQuery<
      GetParticipationsPlain,
      GetParticipationsPlainVariables
    >(GET_PARTICIPATIONS_PLAIN, {
      fetchPolicy: "no-cache",
      variables: {
        filters: {
          participantName: user.name,
          startDate: { lte: currentDate.toISOString() },
          endDate: { gte: currentDate.toISOString() },
        },
      },
    });

    const mapOptions = useMemo((): OptionsType<OptionType> => {
      const mappedOptions: OptionType[] = [];
      data?.getParticipations.forEach((it) => {
        mappedOptions.push({
          value: it.id,
          label: it.challenge.name,
        });
      });
      if (activeParticipation) {
        return [
          ...mappedOptions,
          {
            value: activeParticipation.id,
            label: activeParticipation.challenge.name,
          },
        ];
      }
      return mappedOptions;
    }, [data, activeParticipation]);

    const onChange = (selectedValue: OptionType | null) => {
      setValue(value);
      onSelect(selectedValue);
    };

    useImperativeHandle(ref, () => ({
      refetchOptions() {
        refetch();
      },
      setValue(newValue: OptionType | null) {
        setValue(newValue);
      },
    }));

    useEffect(() => {
      const activeChallenge = activeParticipation?.challenge;
      if (activeChallenge?.id !== value?.value) {
        setValue(
          activeChallenge
            ? {
                value: activeChallenge.id,
                label: activeChallenge.name,
              }
            : null
        );
      }
    }, [activeParticipation, value]);

    return (
      <Box
        width={{ base: "100%", sm: "400px" }}
        color="text.light"
        {...containerProps}
      >
        <Select
          isLoading={loading || isLoading}
          isDisabled={loading || isLoading}
          defaultValue={
            initialValue &&
            mapOptions?.find((it) => it.value === initialValue.value)
          }
          value={value}
          options={options || mapOptions}
          onChange={onChange}
          noOptionsMessage={() =>
            "Ei valittavia haasteita. Liity ensin johonkin haasteeseen"
          }
          placeholder="Valitse haaste"
        />
        {error && <Text color="warning">{error.message}</Text>}
      </Box>
    );
  }
);

export default ParticipationSelect;
