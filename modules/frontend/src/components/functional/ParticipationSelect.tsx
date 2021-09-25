import { useQuery } from "@apollo/client";
import { BoxProps } from "@chakra-ui/react";
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
import { getParticipationDateString } from "../../util/challengeUtils";
import {
  GetParticipationsPlain,
  GetParticipationsPlainVariables,
} from "../../__generated__/GetParticipationsPlain";
import Select, { OptionType } from "../general/Select";

type ParticipationSelectProps = {
  initialValue?: OptionType;
  onSelect: (value: OptionType | null) => Promise<void> | void;
  isLoading?: boolean;
  containerProps?: BoxProps;
  options?: OptionsType<OptionType>;
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
    const [selected, setSelected] = useState<OptionType | null>();
    const user = useGlobal((state) => state.currentUser)[0];
    const activeParticipation = useGlobal(
      (state) => state.activeParticipation
    )[0];

    const { data, loading, error, refetch } = useQuery<
      GetParticipationsPlain,
      GetParticipationsPlainVariables
    >(GET_PARTICIPATIONS_PLAIN, {
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
          label: `${it.challenge.name} ${getParticipationDateString(it)}`,
        });
      });
      if (
        activeParticipation &&
        !mappedOptions.some((it) => it.value === activeParticipation.id)
      ) {
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
      setSelected(selectedValue);
      onSelect(selectedValue);
    };

    useImperativeHandle(ref, () => ({
      refetchOptions() {
        refetch();
      },
      setValue(newValue: OptionType | null) {
        setSelected(newValue);
      },
    }));

    useEffect(() => {
      if (activeParticipation?.id !== selected?.value) {
        setSelected(
          activeParticipation
            ? {
                value: activeParticipation.id,
                label: `${
                  activeParticipation.challenge.name
                } ${getParticipationDateString(activeParticipation)}`,
              }
            : null
        );
      }
    }, [activeParticipation, selected]);

    return (
      <Select
        isLoading={loading || isLoading}
        isDisabled={loading || isLoading}
        defaultValue={
          initialValue &&
          mapOptions?.find((it) => it.value === initialValue.value)
        }
        value={selected}
        options={options || mapOptions}
        onChange={onChange}
        noOptionsMessage={() =>
          "Ei valittavia haasteita. Liity ensin johonkin haasteeseen"
        }
        placeholder="Valitse haaste"
        containerProps={containerProps}
        error={error && error.message}
      />
    );
  }
);

export default ParticipationSelect;
