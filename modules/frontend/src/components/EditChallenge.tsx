import { useApolloClient, useMutation } from "@apollo/client";
import {
  useDisclosure,
  Stack,
  FormLabel,
  FormControl,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";
import { isValid } from "date-fns/esm";
import React, { useEffect, useState } from "react";
import useGlobal from "store";
import {
  CREATE_CHALLENGE,
  DELETE_CHALLENGE,
  UPDATE_CHALLENGE,
} from "views/challenges/queries";
import {
  CreateChallengeMutation,
  CreateChallengeMutationVariables,
} from "views/challenges/__generated__/CreateChallengeMutation";
import { GetChallengesQuery_getChallenges } from "views/challenges/__generated__/GetChallengesQuery";
import {
  UpdateChallengeMutation,
  UpdateChallengeMutationVariables,
} from "views/challenges/__generated__/UpdateChallengeMutation";
import {
  DeleteChallengeMutation,
  DeleteChallengeMutationVariables,
} from "views/challenges/__generated__/DeleteChallengeMutation";
import DateUtil from "util/DateUtil";
import ModalTemplate, { ModalTemplateProps } from "./general/ModalTemplate";
import { AlertButton, PrimaryButton } from "./primitives/Button";
import { PrimaryInput, PrimaryTextArea } from "./primitives/Input";

type EditChallengeProps = Omit<ModalTemplateProps, "children"> & {
  challenge?: GetChallengesQuery_getChallenges | null;
  onEdit?: () => Promise<void>;
};

type FormValues = {
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
};

const defaultFormValues: FormValues = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
};

const EditChallenge = ({
  challenge,
  onEdit,
  ...modalTemplateProps
}: EditChallengeProps): JSX.Element => {
  const user = useGlobal((state) => state.currentUser)[0];
  const updateError = useGlobal(
    (state) => state.error,
    (actions) => actions.updateError
  )[1];

  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues);
  const [isInitialStateSet, setIsInitialStateSet] = useState(false); // To check if initial state is set to avoid further re-renders
  const [error, setError] = useState<string>();

  const [deleteChallenge, { loading: deleteLoading }] = useMutation<
    DeleteChallengeMutation,
    DeleteChallengeMutationVariables
  >(DELETE_CHALLENGE);

  const [createChallenge, { loading: createLoading }] = useMutation<
    CreateChallengeMutation,
    CreateChallengeMutationVariables
  >(CREATE_CHALLENGE);

  const [updateChallenge, { loading: updateLoading }] = useMutation<
    UpdateChallengeMutation,
    UpdateChallengeMutationVariables
  >(UPDATE_CHALLENGE);

  const isLoading = () => {
    return deleteLoading || createLoading || updateLoading;
  };

  const disclosureProps = useDisclosure({
    isOpen: modalTemplateProps.isOpen,
    onOpen: modalTemplateProps.onOpen,
    onClose: () => {
      if (modalTemplateProps.onClose) {
        modalTemplateProps.onClose();
      }
      console.log("Setting initialState to false");

      setError(undefined);
      setIsInitialStateSet(false);
      setFormValues(defaultFormValues); // Reset formvalues on close
    },
  });

  useEffect(() => {
    let unmounted = false;
    // If marking is passed as prop, initialize form with it's values
    if (challenge && !isInitialStateSet) {
      const newFormValues = {
        ...defaultFormValues,
      };
      const { name, description, startDate, endDate } = challenge;
      if (name) newFormValues.name = name;
      if (description) newFormValues.description = description;
      if (startDate)
        newFormValues.startDate = DateUtil.format(startDate, {
          formatString: "yyyy-MM-dd",
        });
      if (endDate)
        newFormValues.endDate = DateUtil.format(endDate, {
          formatString: "yyyy-MM-dd",
        });
      console.log(newFormValues);

      if (!unmounted) {
        setFormValues(newFormValues);
        setIsInitialStateSet(true); // Set that initialstate is changed, so this wont trigger again
      }
    }
    return () => {
      unmounted = true;
    };
  }, [formValues, isInitialStateSet, challenge]);

  const updateFormValues = (values: FormValues) => {
    console.log(values);

    setFormValues(values);
  };

  const saveAndClose = async () => {
    const { startDate, endDate, ...rest } = formValues;

    const input: FormValues = {
      ...rest,
      startDate: isValid(new Date(startDate || "")) ? startDate : undefined,
      endDate: isValid(new Date(endDate || "")) ? endDate : undefined,
    };

    console.log(input);

    try {
      // If challenge exists, edit that
      if (challenge) {
        const result = await updateChallenge({
          variables: {
            id: challenge.id,
            args: {
              ...input,
            },
          },
        });
        if (result.data && onEdit) {
          await onEdit();
        }
      }
      // Otherwise create new challenge
      else {
        const result = await createChallenge({
          variables: {
            challenge: {
              ...input,
              creatorName: user.name,
            },
          },
        });
        if (result.data && onEdit) {
          await onEdit();
        }
      }
      disclosureProps.onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteAndClose = async () => {
    try {
      if (challenge) {
        await deleteChallenge({
          variables: {
            id: challenge.id,
          },
        });
        disclosureProps.onClose();
      } else
        setError(
          "Poistettavaa haastetta ei löytynyt, tämä on varmaakin virhe koodissa:("
        );
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <ModalTemplate
      openButtonLabel="Luo haaste"
      headerLabel={challenge ? "Muokataan haastetta" : "Luo haaste"}
      openButtonProps={{ size: "md" }}
      modalBodyProps={{ pt: "0" }}
      modalFooterProps={{ justifyContent: "flex-start" }}
      modalFooter={
        <>
          <PrimaryButton
            isLoading={createLoading || updateLoading}
            isDisabled={deleteLoading}
            loadingText={challenge ? "Tallenetaan..." : "Luodaan..."}
            mr={3}
            onClick={saveAndClose}
          >
            {challenge ? "Tallenna" : "Luo haaste"}
          </PrimaryButton>
          {challenge ? (
            <AlertButton
              isLoading={deleteLoading}
              isDisabled={createLoading || updateLoading}
              loadingText="Poista"
              onClick={deleteAndClose}
            >
              Poista
            </AlertButton>
          ) : (
            <Box />
          )}
        </>
      }
      {...modalTemplateProps}
      {...disclosureProps}
    >
      <Stack pt="0">
        <FormControl pt="0">
          <FormLabel htmlFor="name">Nimi</FormLabel>
          <PrimaryInput
            id="name"
            placeholder="Kuukauven paasto!!"
            type="text"
            value={formValues.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateFormValues({
                ...formValues,
                name: event.target.value,
              })
            }
          />
        </FormControl>
        <Flex>
          <FormControl pt="0">
            <FormLabel htmlFor="startDate">Alkupäivämäärä</FormLabel>
            <PrimaryInput
              id="startDate"
              placeholder="01.01.2021"
              type="date"
              value={formValues.startDate}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                updateFormValues({
                  ...formValues,
                  startDate: event.target.value,
                })
              }
            />
          </FormControl>
          <FormControl pt="0">
            <FormLabel htmlFor="endDate">Loppupäivämäärä</FormLabel>
            <PrimaryInput
              id="endDate"
              placeholder="31.01.2021"
              type="date"
              value={formValues.endDate}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                updateFormValues({
                  ...formValues,
                  endDate: event.target.value,
                })
              }
            />
          </FormControl>
        </Flex>

        <FormControl pt="0">
          <FormLabel htmlFor="description">Kuvaus</FormLabel>
          <PrimaryTextArea
            id="description"
            placeholder="Kuvaus haasteesta..."
            type="text"
            value={formValues.description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateFormValues({
                ...formValues,
                description: event.target.value,
              })
            }
          />
        </FormControl>
        {error && <Text color="warning">{error}</Text>}
      </Stack>
    </ModalTemplate>
  );
};

export default EditChallenge;
