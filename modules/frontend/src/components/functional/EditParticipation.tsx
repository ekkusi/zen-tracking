import { gql, useMutation } from "@apollo/client";
import {
  useDisclosure,
  Text,
  Flex,
  Box,
  Checkbox,
  Button,
} from "@chakra-ui/react";
import { isBefore, isValid, add } from "date-fns";
import React, { useState, useMemo } from "react";
import DateUtil from "util/DateUtil";
import { Form, Formik, FormikErrors } from "formik";
import ModalTemplate, { ModalTemplateProps } from "../general/ModalTemplate";
import FormField from "../general/form/FormField";
import ConfirmationModal from "../general/ConfirmationModal";
import { participationInfoFragment } from "../../fragments";
import { ParticipationInfo } from "../../__generated__/ParticipationInfo";
import {
  DeleteParticipation,
  DeleteParticipationVariables,
} from "./__generated__/DeleteParticipation";
import {
  CreateParticipation,
  CreateParticipationVariables,
} from "./__generated__/CreateParticipation";
import { ChallengeData } from "../../__generated__/ChallengeData";
import { getParticipationDateString } from "../../util/challengeUtils";
import {
  UpdateParticipation,
  UpdateParticipationVariables,
} from "./__generated__/UpdateParticipation";

export const CREATE_PARTICIPATION = gql`
  mutation CreateParticipation($input: CreateParticipationInput!) {
    createParticipation(input: $input) {
      ...ParticipationInfo
    }
  }
  ${participationInfoFragment}
`;

export const UPDATE_PARTICIPATION = gql`
  mutation UpdateParticipation($id: ID!, $input: UpdateParticipationInput!) {
    updateParticipation(id: $id, input: $input) {
      ...ParticipationInfo
    }
  }
  ${participationInfoFragment}
`;

export const DELETE_PARTICIPATION = gql`
  mutation DeleteParticipation($id: ID!) {
    deleteParticipation(id: $id)
  }
`;

type EditParticipationProps = Omit<ModalTemplateProps, "children"> & {
  challenge: ChallengeData;
  participation?: ParticipationInfo;
  onEdit?: (participation: ParticipationInfo) => Promise<void> | void;
  onDelete?: (participation: ParticipationInfo) => Promise<void> | void;
  saveButtonLabel?: string;
};

type FormValues = {
  isPrivate: boolean;
  startDate: string;
  endDate: string;
};

const inputDateFormat = "yyyy-MM-dd";

const EditParticipation = ({
  challenge,
  participation,
  onEdit,
  onDelete,
  saveButtonLabel,
  ...modalTemplateProps
}: EditParticipationProps): JSX.Element => {
  const [generalError, setGeneralError] = useState<string>();

  const [deleteParticipation, { loading: deleteLoading }] = useMutation<
    DeleteParticipation,
    DeleteParticipationVariables
  >(DELETE_PARTICIPATION);

  const [createParticipation, { loading: createLoading }] = useMutation<
    CreateParticipation,
    CreateParticipationVariables
  >(CREATE_PARTICIPATION);

  const [updateParticipation, { loading: updateLoading }] = useMutation<
    UpdateParticipation,
    UpdateParticipationVariables
  >(UPDATE_PARTICIPATION);

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
    if (participation) {
      const { startDate, endDate, isPrivate } = participation;
      return {
        startDate: startDate
          ? DateUtil.format(startDate, {
              formatString: inputDateFormat,
            })
          : "",
        endDate: endDate
          ? DateUtil.format(endDate, {
              formatString: inputDateFormat,
            })
          : "",
        isPrivate,
      };
    }
    const startDate = new Date();
    const endDate = add(startDate, {
      months: 1,
    });
    return {
      startDate: DateUtil.format(startDate, {
        formatString: inputDateFormat,
      }),
      endDate: DateUtil.format(endDate, {
        formatString: inputDateFormat,
      }),
      isPrivate: false,
    };
  }, [participation]);

  const validateStartDate = (value: string | undefined) => {
    let error;
    const startDate = value ? new Date(value) : undefined;
    if (startDate && !isValid(startDate))
      error = "Alkupäivämäärä ei ole validissa muodossa";
    return error;
  };

  const validateEndDate = (value: string | undefined) => {
    let error;
    const endDate = value ? new Date(value) : undefined;
    if (endDate && !isValid(endDate))
      error = "Alkupäivämäärä ei ole oikeassa muodossa";
    return error;
  };

  const validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    const startDate = new Date(values.startDate);
    const endDate = new Date(values.endDate);
    if (!isValid(startDate)) {
      errors.startDate = "Alkupäivämäärä täytyy olla asetettu";
    }
    if (!isValid(endDate)) {
      errors.endDate = "Loppupäivämäärä täytyy olla asetettu";
    }
    if (isBefore(endDate, startDate)) {
      errors.endDate = "Loppupäivämäärän täytyy olla alkupäivämäärää myöhemmin";
    }
    return errors;
  };

  const saveAndClose = async (input: FormValues) => {
    try {
      // If participation exists, edit that
      if (participation) {
        const result = await updateParticipation({
          variables: {
            id: participation.id,
            input,
          },
        });
        if (result.data && onEdit) {
          await onEdit(result.data.updateParticipation);
        }
      }
      // Otherwise create new challenge
      else {
        const result = await createParticipation({
          variables: {
            input: {
              challengeId: challenge.id,
              ...input,
            },
          },
        });
        if (result.data && onEdit) {
          await onEdit(result.data.createParticipation);
        }
      }
      disclosureProps.onClose();
    } catch (e) {
      setGeneralError(e.message);
    }
  };

  const deleteAndClose = async () => {
    try {
      if (participation) {
        const result = await deleteParticipation({
          variables: {
            id: participation.id,
          },
        });
        if (result.data?.deleteParticipation && onDelete) {
          await onDelete(participation);
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
      openButtonLabel="Aloita haaste"
      headerLabel={
        participation
          ? `Muokataan haasteen ${challenge.name} osallistumistasi`
          : `Aloita haaste ${challenge.name}`
      }
      openButtonProps={{ size: "md" }}
      modalBodyProps={{ pt: "0" }}
      modalFooterProps={{ justifyContent: "flex-start" }}
      hasFooter={false}
      size="2xl"
      {...modalTemplateProps}
      {...disclosureProps}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={saveAndClose}
        validateOnChange={false}
        validateOnBlur={false}
        validate={validate}
      >
        {({ values, setFieldValue }) => (
          <Form>
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
            <Checkbox
              isChecked={values.isPrivate}
              onChange={(event) =>
                setFieldValue("isPrivate", event.target.checked)
              }
            >
              <Text as="span" fontSize="sm">
                Tämä on yksityinen osallistuminen.
              </Text>
            </Checkbox>
            <Box my="5">
              <Button
                type="submit"
                isLoading={createLoading || updateLoading}
                isDisabled={deleteLoading}
                loadingText={participation ? "Tallenetaan..." : "Luodaan..."}
                mr={3}
              >
                {saveButtonLabel ||
                  (participation ? "Tallenna" : "Aloita haaste")}
              </Button>
              {participation && (
                <ConfirmationModal
                  variant="delete"
                  onAccept={deleteAndClose}
                  headerLabel="Poista osallistuminen"
                  openButtonProps={{
                    isLoading: deleteLoading,
                    isDisabled: createLoading,
                    loadingText: "Poistetaan...",
                  }}
                >
                  <Text>
                    Oletko varma, että haluat poistaa ajan
                    {getParticipationDateString(participation)}
                    osallistumisesi haasteesta {challenge.name}?
                    <br />
                    HUOM! tällöin myös kaikki merkkauksesi kyseisestä
                    osallistumesta poistuvat.
                  </Text>
                </ConfirmationModal>
              )}
            </Box>

            {generalError && <Text color="warning">{generalError}</Text>}
          </Form>
        )}
      </Formik>
    </ModalTemplate>
  );
};

export default EditParticipation;
