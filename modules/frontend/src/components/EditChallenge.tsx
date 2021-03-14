import { useMutation } from "@apollo/client";
import { useDisclosure, Text, Flex, Box } from "@chakra-ui/react";
import { isValid } from "date-fns/esm";
import React, { useState, useMemo } from "react";
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
import { Form, Formik } from "formik";
import ModalTemplate, { ModalTemplateProps } from "./general/ModalTemplate";
import { AlertButton, PrimaryButton } from "./primitives/Button";
import FormField from "./general/form/FormField";
import { PrimaryTextArea } from "./primitives/Input";

type EditChallengeProps = Omit<ModalTemplateProps, "children"> & {
  challenge?: GetChallengesQuery_getChallenges | null;
  onEdit?: (
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
  saveButtonLabel,
  requireDates = false,
  minStartDate,
  maxStartDate,
  minEndDate,
  maxEndDate,
  ...modalTemplateProps
}: EditChallengeProps): JSX.Element => {
  const user = useGlobal((state) => state.currentUser)[0];

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
              creatorName: user.name,
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
        if (result.data?.deleteChallenge && onEdit) {
          await onEdit(challenge);
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
              <AlertButton
                isLoading={deleteLoading}
                isDisabled={createLoading || updateLoading}
                loadingText="Poista"
                onClick={deleteAndClose}
              >
                Poista
              </AlertButton>
            )}
          </Box>

          {generalError && <Text color="warning">{generalError}</Text>}
        </Form>
      </Formik>
    </ModalTemplate>
  );
};

export default EditChallenge;
