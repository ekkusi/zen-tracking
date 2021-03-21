import { gql, useMutation } from "@apollo/client";
import { useDisclosure, Text, Flex, Box } from "@chakra-ui/react";
import { isValid } from "date-fns/esm";
import React, { useState, useMemo } from "react";
import { GetChallengesQuery_getChallenges } from "views/challenges/__generated__/GetChallengesQuery";
import DateUtil from "util/DateUtil";
import { Form, Formik } from "formik";
import { challengeWithParticipationsFragment } from "views/challenges/queries";
import {
  DeleteChallengeMutation,
  DeleteChallengeMutationVariables,
} from "./__generated__/DeleteChallengeMutation";
import {
  UpdateChallengeMutation,
  UpdateChallengeMutationVariables,
} from "./__generated__/UpdateChallengeMutation";
import {
  CreateChallengeMutation,
  CreateChallengeMutationVariables,
} from "./__generated__/CreateChallengeMutation";
import ModalTemplate, { ModalTemplateProps } from "./general/ModalTemplate";
import { PrimaryButton } from "./primitives/Button";
import FormField from "./general/form/FormField";
import { PrimaryTextArea } from "./primitives/Input";
import DeleteConfimationModal from "./DeleteConfirmationModal";

const CREATE_CHALLENGE = gql`
  mutation CreateChallengeMutation($challenge: CreateChallengeInput!) {
    createChallenge(challenge: $challenge) {
      ...ChallengeWithParticipationsFragment
    }
  }
  ${challengeWithParticipationsFragment}
`;

const UPDATE_CHALLENGE = gql`
  mutation UpdateChallengeMutation($id: ID!, $args: UpdateChallengeInput!) {
    updateChallenge(id: $id, args: $args) {
      ...ChallengeWithParticipationsFragment
    }
  }
  ${challengeWithParticipationsFragment}
`;

const DELETE_CHALLENGE = gql`
  mutation DeleteChallengeMutation($id: ID!) {
    deleteChallenge(id: $id)
  }
`;

type EditChallengeProps = Omit<ModalTemplateProps, "children"> & {
  challenge?: GetChallengesQuery_getChallenges | null;
  onEdit?: (
    challenge: GetChallengesQuery_getChallenges
  ) => Promise<void> | void;
  onDelete?: (
    challenge: GetChallengesQuery_getChallenges
  ) => Promise<void> | void;
  saveButtonLabel?: string;
  requireDates?: boolean;
  minStartDate?: Date;
  maxStartDate?: Date;
  minEndDate?: Date;
  maxEndDate?: Date;
};

type FormValues = {
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
};

const errorDateFormat = "dd.MM.yyyy";

const EditChallenge = ({
  challenge,
  onEdit,
  onDelete,
  saveButtonLabel,
  requireDates = false,
  minStartDate,
  maxStartDate,
  minEndDate,
  maxEndDate,
  ...modalTemplateProps
}: EditChallengeProps): JSX.Element => {
  const [generalError, setGeneralError] = useState<string>();

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

  const disclosureProps = useDisclosure({
    isOpen: modalTemplateProps.isOpen,
    onOpen: modalTemplateProps.onOpen,
    onClose: () => {
      if (modalTemplateProps.onClose) {
        modalTemplateProps.onClose();
      }

      setGeneralError(undefined);
    },
  });

  const initialValues = useMemo((): FormValues => {
    const { name = "", description = "", startDate, endDate } = challenge || {};
    return {
      name,
      description,
      startDate: startDate
        ? DateUtil.format(startDate, {
            formatString: "yyyy-MM-dd",
          })
        : "",
      endDate: endDate
        ? DateUtil.format(endDate, {
            formatString: "yyyy-MM-dd",
          })
        : "",
    };
  }, [challenge]);

  const validateName = (value: string) => {
    let error;
    if (value.length === 0) error = "Nimi ei saa olla tyhjä";
    return error;
  };

  const validateDescription = (value: string) => {
    let error;

    if (value.length === 0) error = "Kuvaus ei saa olla tyhjä!";
    return error;
  };

  const validateStartDate = (value: string | undefined) => {
    let error;
    const startDate = value ? new Date(value) : undefined;
    if (startDate && !isValid(startDate))
      error = "Alkupäivämäärä ei ole validissa muodossa";
    if (
      minStartDate &&
      (!startDate || !DateUtil.isSameDayOrAfter(startDate, minStartDate))
    )
      error = `Alkupäivämäärä pitää olla vähintään ${DateUtil.format(
        minStartDate,
        {
          formatString: errorDateFormat,
        }
      )}`;
    if (
      maxStartDate &&
      (!startDate || !DateUtil.isSameDayOrBefore(startDate, maxStartDate))
    )
      error = `Alkupäivämäärä saa olla enintään ${DateUtil.format(
        maxStartDate,
        {
          formatString: errorDateFormat,
        }
      )}`;
    if (requireDates && !startDate)
      error = "Alkupäivämäärä täytyy olla asetettu";
    return error;
  };

  const validateEndDate = (value: string | undefined) => {
    let error;
    const endDate = value ? new Date(value) : undefined;
    if (endDate && !isValid(endDate))
      error = "Alkupäivämäärä ei ole oikeassa muodossa";

    if (
      minEndDate &&
      (!endDate || !DateUtil.isSameDayOrAfter(endDate, minEndDate))
    )
      error = `Loppupäivämäärä pitää olla vähintään ${DateUtil.format(
        minEndDate,
        {
          formatString: errorDateFormat,
        }
      )}`;
    if (
      maxEndDate &&
      (!endDate || !DateUtil.isSameDayOrBefore(endDate, maxEndDate))
    )
      error = `Loppupäivämäärä saa olla enintään ${DateUtil.format(maxEndDate, {
        formatString: errorDateFormat,
      })}`;
    if (requireDates && !endDate)
      error = "Loppupäivämäärä täytyy olla asetettu";
    return error;
  };

  const saveAndClose = async (values: FormValues) => {
    const input: FormValues = {
      name: values.name,
      description: values.description,
      startDate: values.startDate ? values.startDate : undefined, // If string length === 0, pass undefined
      endDate: values.endDate ? values.endDate : undefined, // If string length === 0, pass undefined
    };
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
          await onEdit(result.data.updateChallenge);
        }
      }
      // Otherwise create new challenge
      else {
        const result = await createChallenge({
          variables: {
            challenge: {
              ...input,
            },
          },
        });
        if (result.data && onEdit) {
          await onEdit(result.data.createChallenge);
        }
      }
      disclosureProps.onClose();
    } catch (e) {
      setGeneralError(e.message);
    }
  };

  const deleteAndClose = async () => {
    try {
      if (challenge) {
        const result = await deleteChallenge({
          variables: {
            id: challenge.id,
          },
        });
        if (result.data?.deleteChallenge && onDelete) {
          await onDelete(challenge);
        }
        disclosureProps.onClose();
      } else
        setGeneralError(
          "Poistettavaa haastetta ei löytynyt, tämä on varmaakin virhe koodissa:("
        );
    } catch (e) {
      setGeneralError(e.message);
    }
  };

  return (
    <ModalTemplate
      openButtonLabel="Luo haaste"
      headerLabel={challenge ? "Muokataan haastetta" : "Luo haaste"}
      openButtonProps={{ size: "md" }}
      modalBodyProps={{ pt: "0" }}
      modalFooterProps={{ justifyContent: "flex-start" }}
      hasFooter={false}
      {...modalTemplateProps}
      {...disclosureProps}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={saveAndClose}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Form>
          <FormField
            name="name"
            type="text"
            placeholder="Kuukauven paasto!!"
            label="Nimi"
            validate={validateName}
          />
          <Flex direction={{ base: "column", sm: "row" }}>
            <FormField
              name="startDate"
              type="date"
              label="Alkupäivämäärä"
              validate={validateStartDate}
              containerProps={{
                pt: "0",
                mb: { base: "2", sm: "0" },
                mr: { base: "0", sm: "3" },
              }}
            />
            <FormField
              name="endDate"
              type="date"
              label="Loppupäivämäärä"
              validate={validateEndDate}
              containerProps={{
                pt: "0",
              }}
            />
          </Flex>

          <FormField
            as={PrimaryTextArea}
            name="description"
            type="text"
            placeholder="Kuvaus haasteesta..."
            label="Kuvaus"
            validate={validateDescription}
          />
          <Box my="5">
            <PrimaryButton
              type="submit"
              isLoading={createLoading || updateLoading}
              isDisabled={deleteLoading}
              loadingText={challenge ? "Tallenetaan..." : "Luodaan..."}
              mr={3}
              // onClick={saveAndClose}
            >
              {saveButtonLabel || (challenge ? "Tallenna" : "Luo haaste")}
            </PrimaryButton>
            {challenge && (
              // <AlertButton

              //   onClick={deleteAndClose}
              // >
              //   Poista
              // </AlertButton>
              <DeleteConfimationModal
                onDelete={deleteAndClose}
                headerLabel="Poista haaste"
                openButtonProps={{
                  isLoading: deleteLoading,
                  isDisabled: createLoading || updateLoading,
                  loadingText: "Poistetaan...",
                }}
              >
                <Text>
                  Oletko varma, että haluat poistaa haasteen {challenge.name}?
                  Jos sinulla on ilmoittautuminen haasteen, poistuu myös tämä
                  sekä kaikki sen merkkaukset.
                </Text>
              </DeleteConfimationModal>
            )}
          </Box>

          {generalError && <Text color="warning">{generalError}</Text>}
        </Form>
      </Formik>
    </ModalTemplate>
  );
};

export default EditChallenge;
