import { useMutation, gql } from "@apollo/client";
import {
  Box,
  Checkbox,
  Flex,
  FormLabel,
  Icon,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { UploadImageSuccessResult } from "@ekkusi/zen-tracking-backend/lib/types/restApiResponses";
import ModalTemplate, {
  ModalTemplateProps,
} from "components/general/ModalTemplate";
import { PrimaryButton } from "components/primitives/Button";
import { PrimaryTextArea } from "components/primitives/Input";
import FileInput from "components/general/form/FileInput";
import React, { useMemo, useState } from "react";
import useGlobal from "store";
import DateUtil from "util/DateUtil";
import LogRocket from "logrocket";
import { IoMdCamera } from "react-icons/io";
import { IoLeaf } from "react-icons/io5";
import { Form, Formik, FormikErrors } from "formik";
import { markingDataFragment } from "fragments";
import FormField from "../general/form/FormField";
import PreviewImage from "../general/form/PreviewImage";
import { PlainIconButton } from "../primitives/IconButton";
import DeleteConfimationModal from "../general/DeleteConfirmationModal";
import {
  DeleteMarking,
  DeleteMarkingVariables,
} from "./__generated__/DeleteMarking";
import { AddMarking, AddMarkingVariables } from "./__generated__/AddMarking";
import {
  EditMarking as EditMarkingQuery,
  EditMarkingVariables,
} from "./__generated__/EditMarking";

export const ADD_MARKING = gql`
  mutation AddMarking($participationId: ID!, $marking: MarkingCreateInput!) {
    addMarking(participationId: $participationId, marking: $marking) {
      ...MarkingData
    }
  }
  ${markingDataFragment}
`;

export const EDIT_MARKING = gql`
  mutation EditMarking($id: ID!, $marking: MarkingUpdateInput!) {
    editMarking(id: $id, marking: $marking) {
      ...MarkingData
    }
  }
  ${markingDataFragment}
`;

export const DELETE_MARKING = gql`
  mutation DeleteMarking($id: ID!) {
    deleteMarking(id: $id)
  }
`;

type EditMarkingProps = Omit<ModalTemplateProps, "children"> & {
  marking?: Marking | null;
  date?: Date | null;
};

type FormValues = {
  rating: number;
  comment: string;
  photo: File | string | null;
  isPrivate: boolean;
};
const MAX_COMMENT_LENGTH = 2000;

const backendApiBaseUrl = process.env.REACT_APP_BACKEND_API_BASE_URL || "";

const EditMarking = ({
  marking,
  date,
  ...modalTemplateProps
}: EditMarkingProps): JSX.Element => {
  const [activeParticipation, updateActiveParticipationMarkings] = useGlobal(
    (state) => state.activeParticipation,
    (actions) => actions.updateActiveParticipationMarkings
  );
  const updateError = useGlobal(
    (state) => state.error,
    (actions) => actions.updateError
  )[1];
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [photoSrc, setPhotoSrc] = useState<File | string | null>(null);

  const [deleteMarking, { loading: deleteLoading }] = useMutation<
    DeleteMarking,
    DeleteMarkingVariables
  >(DELETE_MARKING);

  const [createMarking, { loading: createLoading }] = useMutation<
    AddMarking,
    AddMarkingVariables
  >(ADD_MARKING);

  const [editMarking, { loading: updateLoading }] = useMutation<
    EditMarkingQuery,
    EditMarkingVariables
  >(EDIT_MARKING);

  const disclosureProps = useDisclosure({
    isOpen: modalTemplateProps.isOpen,
    onOpen: modalTemplateProps.onOpen,
    onClose: () => {
      if (modalTemplateProps.onClose) {
        modalTemplateProps.onClose();
      }
      setError(undefined);
      setPhotoSrc(null);
    },
  });

  const initialValues = useMemo((): FormValues => {
    if (marking?.photoUrl && !photoSrc) setPhotoSrc(marking?.photoUrl);
    return {
      rating: marking?.rating || 3,
      comment: marking?.comment || "",
      photo: marking?.photoUrl || null,
      isPrivate: marking?.isPrivate || activeParticipation?.isPrivate || false,
    };
  }, [marking, photoSrc, activeParticipation]);

  const getPhotoSrc = useMemo(() => {
    if (!photoSrc) return undefined;
    if (typeof photoSrc === "string") {
      return photoSrc;
    }
    return URL.createObjectURL(photoSrc);
  }, [photoSrc]);

  const saveAndClose = async (values: FormValues) => {
    // This shouldn't get triggered, activeParticipation should be found if EditMarking is open
    if (!activeParticipation) {
      updateError(
        "Ei voida tallentaa merkkausta, koska nykyistä haastetta ei ole valittuna"
      );
      return;
    }

    setLoading(true);
    const { comment, photo, rating, isPrivate } = values;
    // If photo is defined -> initialize as undefined to avoid unnecessary delete in backend, if null then null to delete. If value is File -> next upload will handle updating this variable
    let photoUrl: string | undefined | null = photo ? undefined : null;
    // If this photo is File and not string or undefined, it is new file -> upload
    if (photo instanceof File) {
      try {
        const formData = new FormData();
        formData.append("photo", photo);
        const response = await fetch(`${backendApiBaseUrl}/upload-image`, {
          method: "POST",
          body: formData,
        });
        const data: UploadImageSuccessResult = await response.json();
        photoUrl = data.url;
      } catch (e) {
        setLoading(false);
        setError(`Jokin meni vikaan kuvan lisäyksessä: ${e.message}`);
        return;
      }
    }
    try {
      // User markings after edit/create. Set to null if update fails to not trigger update in global state.
      let newMarkings: Marking[] | null = null;
      // If marking exists, edit that
      if (marking) {
        const result = await editMarking({
          variables: {
            id: marking.id,
            marking: {
              comment,
              photoUrl,
              rating,
              isPrivate,
            },
          },
        });
        if (result.data) {
          // Update edited marking if mutate returns data. User should always be defined here.
          const editedMarking = result.data.editMarking;
          const editedMarkingIndex = activeParticipation.markings.findIndex(
            (it) => it.id === editedMarking.id
          );
          newMarkings = [...activeParticipation.markings];
          if (editedMarkingIndex >= 0) {
            newMarkings[editedMarkingIndex] = editedMarking;
          } else {
            // If edited marking isn't found for some reason, add it (should always go to upper if-statement here)
            newMarkings.push(editedMarking);
          }
        }
      }
      // Otherwise create new marking
      else {
        const result = await createMarking({
          variables: {
            marking: {
              comment,
              date,
              photoUrl,
              rating,
              isPrivate,
            },
            participationId: activeParticipation.id,
          },
        });
        if (result.data)
          // Add created marking if mutate returns data. User should always be defined here.
          newMarkings = [
            ...activeParticipation.markings,
            result.data.addMarking,
          ];
      }

      // Update user markings in frontend also, no need to refetch from backend
      if (newMarkings) {
        updateActiveParticipationMarkings(newMarkings);
      }
      setLoading(false);
      disclosureProps.onClose();
    } catch (e) {
      if (photoUrl) {
        const formData = new FormData();
        formData.append("fileName", photoUrl);
        const response = await fetch(`${backendApiBaseUrl}/delete-image`, {
          method: "POST",
          body: formData,
        });
        if (response.status !== 200) {
          LogRocket.error(
            `Something went wrong with file ${photoUrl} delete: ${await response.text()}`
          );
        }
      }
      setLoading(false);
      setError(`Jokin meni vikaan merkkauksen muokkauksessa: ${e.message}`);
    }
  };

  const deleteAndClose = async () => {
    // This shouldn't get triggered, activeParticipation should be found if EditMarking is open
    if (!activeParticipation) {
      updateError(
        "Ei voida poistaa merkkausta, koska nykyistä haastetta ei ole valittuna"
      );
      return;
    }
    setLoading(true);

    try {
      if (marking) {
        const { data } = await deleteMarking({
          variables: {
            id: marking.id,
          },
        });
        if (data) {
          // Delete marking from activeParticipation in frontend also, no need to refetch from backend
          updateActiveParticipationMarkings(
            activeParticipation.markings.filter((it) => it.id !== marking.id)
          );
        }
      } else {
        setError(
          `No marking passed to EditMarking as prop, this error shouldn't be shown -> something is wrong with THA CODE`
        );
      }
      disclosureProps.onClose();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError(`Jokin meni vikaan merkkauksen poistossa: ${e.message}`);
    }
  };

  const validateRating = (values: FormValues): FormikErrors<FormValues> => {
    const errors: FormikErrors<FormValues> = {};
    if (values.rating <= 0) {
      errors.rating = "Anna arvostelu päivän suorituksesta";
    }
    return errors;
  };

  return (
    <ModalTemplate
      openButtonLabel="Lisää merkkaus"
      headerLabel={marking ? "Muokataan merkkausta" : "Lisää merkkaus"}
      openButtonProps={{ size: "md" }}
      modalBodyProps={{ pt: "0" }}
      modalFooterProps={{ justifyContent: "flex-start" }}
      hasFooter={false}
      {...modalTemplateProps}
      {...disclosureProps}
    >
      <Stack pt="0">
        <Stack>
          {(marking || date) && (
            <FormLabel>
              Päivämäärä:{" "}
              <Text as="span" fontWeight="bold">
                {
                  // @ts-ignore
                  DateUtil.format(marking ? marking.date : date)
                }
              </Text>
            </FormLabel>
          )}
        </Stack>
        <Formik
          initialValues={initialValues}
          onSubmit={saveAndClose}
          validate={validateRating}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ values, setFieldValue, errors, setFieldError }) => (
            <Form>
              <Box mb="2">
                <FormLabel>Kuinka hyvin meni päivän setti</FormLabel>
                {[1, 2, 3, 4, 5].map((it) => (
                  <PlainIconButton
                    key={it}
                    size="lg"
                    aria-label="Set rating value"
                    onClick={() => {
                      setFieldValue("rating", it);
                      setFieldError("rating", undefined);
                    }}
                    onMouseEnter={() => setHoverRating(it)}
                    onMouseLeave={() => setHoverRating(0)}
                    icon={
                      <Icon
                        as={IoLeaf}
                        color={
                          (hoverRating > 0 && hoverRating < it) ||
                          (values.rating < it && hoverRating <= values.rating)
                            ? undefined // Undefined will render default color, which switches between dark/light theme
                            : "primary.regular"
                        }
                        w={10}
                        h={10}
                      />
                    }
                  />
                ))}
                {errors.rating && (
                  <Text as="span" display="block" color="warning">
                    {errors.rating}
                  </Text>
                )}
              </Box>

              <FormField
                as={PrimaryTextArea}
                name="comment"
                label="Valinnainen kommentti päivän suorituksesta"
                placeholder="Päivä meni ihan kivasti... vähän meinas demonit iskeä, mutta onneks löysin sisäisen Excaliburini ja karkotin ne takasin syövereihinsä:)"
                type="text"
                maxLength={MAX_COMMENT_LENGTH}
              >
                <Text as="span" display="block" color="secondary" fontSize="sm">
                  {values.comment.length}/{MAX_COMMENT_LENGTH} merkkiä
                </Text>
              </FormField>

              <Flex
                direction={{ base: "column", sm: "row" }}
                alignItems={{ base: "flex-start", sm: "center" }}
                mb="3"
              >
                <FileInput
                  id="photo"
                  accept="image/*"
                  buttonLabel="Valitse päivän kuva"
                  buttonProps={{
                    rightIcon: (
                      <Icon as={IoMdCamera} w={4} h={4} mb="1px" ml="1" />
                    ),
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newPhoto =
                      event.target.files == null ||
                      event.target.files.length <= 0
                        ? null
                        : event.target.files[0];
                    setFieldValue("photo", newPhoto);
                    setPhotoSrc(newPhoto);
                  }}
                />
                <Text
                  as="span"
                  ml={{ base: "0", sm: "2" }}
                  fontSize="sm"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {!values.photo && "Ei valittua tiedostoa"}
                </Text>
              </Flex>
              {values.photo && (
                <PreviewImage
                  maxWidth="100%"
                  maxHeight="300px"
                  src={getPhotoSrc}
                  onClose={() => {
                    setFieldValue("photo", null);
                    setPhotoSrc(null);
                  }}
                />
              )}
              <Checkbox
                isChecked={values.isPrivate}
                onChange={(event) =>
                  setFieldValue("isPrivate", event.target.checked)
                }
                mt={values.photo ? "3" : "0"}
              >
                <Text as="span" fontSize="sm">
                  Haluan piilottaa tämän merkkauksen muilta.
                </Text>
              </Checkbox>

              {error && <Text color="warning">{error}</Text>}
              <Box mt="5" mb="5">
                <PrimaryButton
                  type="submit"
                  isLoading={loading || createLoading || updateLoading}
                  isDisabled={deleteLoading}
                  loadingText={marking ? "Tallenetaan..." : "Lisätään..."}
                  mr={3}
                >
                  {marking ? "Tallenna" : "Lisää merkkaus"}
                </PrimaryButton>
                {marking && (
                  <DeleteConfimationModal
                    onDelete={deleteAndClose}
                    openButtonLabel="Poista"
                    headerLabel="Poista merkkaus"
                    openButtonProps={{
                      isLoading: loading || deleteLoading,
                      isDisabled: createLoading || updateLoading,
                      loadingText: "Poista",
                    }}
                  >
                    <Text>
                      Oletko varma, että haluat poistaa merkkauksen päivältä{" "}
                      {DateUtil.format(marking.date)}?. Tämä poistaa kaikki
                      merkkauksen tiedot, kuten sen kuvan, mikäli semmoinen on
                      ladattu.
                    </Text>
                  </DeleteConfimationModal>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Stack>
    </ModalTemplate>
  );
};

export default EditMarking;