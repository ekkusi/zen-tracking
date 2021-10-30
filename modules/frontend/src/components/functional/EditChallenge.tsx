import { gql, useMutation } from "@apollo/client";
import {
  useDisclosure,
  Text,
  Box,
  Checkbox,
  Button,
  Textarea,
} from "@chakra-ui/react";
import React, { useState, useMemo } from "react";
import { Form, Formik } from "formik";
import ModalTemplate, { ModalTemplateProps } from "../general/ModalTemplate";
import FormField from "../general/form/FormField";
import ConfirmationModal from "../general/ConfirmationModal";
import {
  DeleteChallenge,
  DeleteChallengeVariables,
} from "./__generated__/DeleteChallenge";
import {
  CreateChallenge,
  CreateChallengeVariables,
} from "./__generated__/CreateChallenge";
import {
  UpdateChallenge,
  UpdateChallengeVariables,
} from "./__generated__/UpdateChallenge";
import { challengeDataFragment } from "../../fragments";
import { GetChallenges_getChallenges } from "../../__generated__/GetChallenges";
import ImageInput from "../general/form/ImageInput";
import { MAX_UPLOAD_FILE_SIZE_MB } from "../../config.json";
import { deleteImage, uploadImage } from "../../util/backend-api";

const CREATE_CHALLENGE = gql`
  mutation CreateChallenge($challenge: CreateChallengeInput!) {
    createChallenge(challenge: $challenge) {
      ...ChallengeData
    }
  }
  ${challengeDataFragment}
`;

const UPDATE_CHALLENGE = gql`
  mutation UpdateChallenge($id: ID!, $args: UpdateChallengeInput!) {
    updateChallenge(id: $id, args: $args) {
      ...ChallengeData
    }
  }
  ${challengeDataFragment}
`;

const DELETE_CHALLENGE = gql`
  mutation DeleteChallenge($id: ID!) {
    deleteChallenge(id: $id)
  }
`;

type EditChallengeProps = Omit<ModalTemplateProps, "children"> & {
  challenge?: GetChallenges_getChallenges | null;
  onEdit?: (challenge: GetChallenges_getChallenges) => Promise<void> | void;
  onDelete?: (challenge: GetChallenges_getChallenges) => Promise<void> | void;
  saveButtonLabel?: string;
};

type FormValues = {
  name: string;
  isPrivate: boolean;
  description: string;
  photo: File | string | null;
};

const EditChallenge = ({
  challenge,
  onEdit,
  onDelete,
  saveButtonLabel,
  ...modalTemplateProps
}: EditChallengeProps): JSX.Element => {
  const [generalError, setGeneralError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [deleteChallenge, { loading: deleteLoading }] = useMutation<
    DeleteChallenge,
    DeleteChallengeVariables
  >(DELETE_CHALLENGE);

  const [createChallenge, { loading: createLoading }] = useMutation<
    CreateChallenge,
    CreateChallengeVariables
  >(CREATE_CHALLENGE);

  const [updateChallenge, { loading: updateLoading }] = useMutation<
    UpdateChallenge,
    UpdateChallengeVariables
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
    const { name = "", description = "", photoUrl } = challenge || {};
    return {
      name,
      description,
      isPrivate: false,
      photo: photoUrl || null,
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

  const validateFile = (file: File | null): string => {
    // * 1024 * 1024 is for converting mb size to bytes, which file.size is in
    if (file && file.size > MAX_UPLOAD_FILE_SIZE_MB * 1024 * 1024) {
      return `Tiedosto saa olla enintään ${MAX_UPLOAD_FILE_SIZE_MB}MB kokoinen.`;
    }
    return "";
  };

  const saveAndClose = async (values: FormValues) => {
    setLoading(true);
    const { photo, ...input } = values;
    // If photo is defined -> initialize as undefined to avoid unnecessary delete in backend, if null then null to delete. If value is File -> next upload will handle updating this variable
    let photoUrl: string | undefined | null = photo ? undefined : null;
    // If this photo is File and not string or undefined, it is new file -> upload
    if (photo instanceof File) {
      try {
        const uploadData = await uploadImage(photo);
        photoUrl = uploadData.url;
      } catch (e) {
        setLoading(false);
        console.error(`Jokin meni vikaan kuvan lisäyksessä: ${e.message}`);
        return;
      }
    }
    try {
      // If challenge exists, edit that
      if (challenge) {
        const result = await updateChallenge({
          variables: {
            id: challenge.id,
            args: {
              ...input,
              photoUrl,
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
              photoUrl,
            },
          },
        });
        if (result.data && onEdit) {
          await onEdit(result.data.createChallenge);
        }
      }
      disclosureProps.onClose();
    } catch (e) {
      if (photoUrl) {
        try {
          await deleteImage(photoUrl);
        } catch (deleteError) {
          console.error(
            `Jokin meni pieleen kuvan poistossa ${deleteError.message}`
          );
        }
      }
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
      size="2xl"
      {...modalTemplateProps}
      {...disclosureProps}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={saveAndClose}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values, errors, setFieldValue, setFieldError }) => (
          <Form>
            <FormField
              name="name"
              type="text"
              placeholder="Kuukauven paasto!!"
              label="Nimi"
              validate={validateName}
            />
            <FormField
              as={Textarea}
              name="description"
              type="text"
              placeholder="Kuvaus haasteesta..."
              label="Kuvaus"
              validate={validateDescription}
            />
            <Box mb="7">
              <ImageInput
                id="challenge-photo"
                accept="image/*"
                buttonLabel="Valitse haasteen kuva"
                initialValue={values.photo}
                buttonProps={{ mb: 0 }}
                containerProps={{ mb: 3 }}
                onChange={(photo: File | null) => {
                  const fileError = validateFile(photo);
                  if (fileError) {
                    setFieldError("photo", fileError);
                    setFieldValue("photo", null);
                  } else {
                    setFieldError("photo", undefined);
                    setFieldValue("photo", photo);
                  }
                }}
              />
              {errors.photo && (
                <Text as="span" display="block" color="warning">
                  {errors.photo}
                </Text>
              )}
            </Box>
            <Checkbox
              isChecked={values.isPrivate}
              onChange={(event) =>
                setFieldValue("isPrivate", event.target.checked)
              }
            >
              <Text as="span" fontSize="sm">
                Tämä on yksityinen haaste.
              </Text>
            </Checkbox>
            <Box my="5">
              <Button
                type="submit"
                isLoading={createLoading || updateLoading || loading}
                isDisabled={deleteLoading}
                loadingText={challenge ? "Tallenetaan..." : "Luodaan..."}
                mr={3}
              >
                {saveButtonLabel || (challenge ? "Tallenna" : "Luo haaste")}
              </Button>
              {challenge && (
                <ConfirmationModal
                  variant="delete"
                  onAccept={deleteAndClose}
                  headerLabel="Poista haaste"
                  openButtonProps={{
                    isLoading: deleteLoading,
                    isDisabled: createLoading || updateLoading || loading,
                    loadingText: "Poistetaan...",
                  }}
                >
                  <Text>
                    Oletko varma, että haluat poistaa haasteen {challenge.name}?
                    Jos olet myös osallisena kyseisessä haasteessa, poistuu
                    kaikki sen merkkaukset.
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

export default EditChallenge;
