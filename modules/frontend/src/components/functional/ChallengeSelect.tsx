import { useQuery } from "@apollo/client";
import { Box, BoxProps, Text } from "@chakra-ui/react";
import { GET_USER_PARTICIPATIONS_PLAIN } from "generalQueries";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  useEffect,
} from "react";

import Select, { OptionsType } from "react-select";
import useGlobal from "store";
import { GetUserParticipationsPlain } from "../../__generated__/GetUserParticipationsPlain";

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
  nullValue: (value: OptionType | null) => void;
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
    const [value, setValue] = useState<OptionType | null>();
    const activeParticipation = useGlobal(
      (state) => state.activeParticipation
    )[0];

    const {
      data,
      loading,
      error,
      refetch,
    } = useQuery<GetUserParticipationsPlain>(GET_USER_PARTICIPATIONS_PLAIN, {
      fetchPolicy: "no-cache",
    });

    const mapOptions = useMemo((): OptionsType<OptionType> => {
      return (
        data?.getUserParticipations.map((it) => ({
          value: it.challenge.id,
          label: it.challenge.name,
        })) || []
      );
    }, [data]);

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

export default ChallengeSelect;
