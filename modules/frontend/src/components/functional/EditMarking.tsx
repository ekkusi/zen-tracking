import { useMutation, gql } from "@apollo/client";
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  Icon,
  IconButton,
  Stack,
  Text,
  Textarea,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import ModalTemplate, {
  ModalTemplateProps,
} from "components/general/ModalTemplate";
import React, { useMemo, useState } from "react";
import useGlobal from "store";
import DateUtil from "util/DateUtil";
import { IoLeaf } from "react-icons/io5";
import { Form, Formik, FormikErrors } from "formik";
import { markingDataFragment } from "fragments";
import { mode } from "@chakra-ui/theme-tools";
import { isSameDay } from "date-fns";
import FormField from "../general/form/FormField";
import ConfirmationModal from "../general/ConfirmationModal";
import {
  DeleteMarking,
  DeleteMarkingVariables,
} from "./__generated__/DeleteMarking";
import { AddMarking, AddMarkingVariables } from "./__generated__/AddMarking";
import {
  EditMarking as EditMarkingQuery,
  EditMarkingVariables,
} from "./__generated__/EditMarking";

import { MAX_UPLOAD_FILE_SIZE_MB } from "../../config.json";
import useOpenRecapModal from "../../hooks/useOpenRecapModal";
import ImageInput from "../general/form/ImageInput";
import { deleteImage, uploadImage } from "../../util/backend-api";

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

export type EditType = "edit" | "create" | "delete";

type EditMarkingProps = Omit<ModalTemplateProps, "children"> & {
  marking?: Marking | null;
  date?: Date | null;
  onEdit?: (marking: Marking, type: EditType) => void;
};

type FormValues = {
  rating: number;
  comment: string;
  photo: File | string | null;
  isPrivate: boolean;
};
const MAX_COMMENT_LENGTH = 2000;

const EditMarking = ({
  marking,
  date,
  onEdit,
  ...modalTemplateProps
}: EditMarkingProps): JSX.Element => {
  const [activeParticipation, updateActiveParticipationMarkings] = useGlobal(
    (state) => state.activeParticipation,
    (actions) => actions.updateActiveParticipationMarkings
  );
  const user = useGlobal((state) => state.currentUser)[0];
  const updateError = useGlobal(
    (state) => state.error,
    (actions) => actions.updateError
  )[1];
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [photoSrc, setPhotoSrc] = useState<File | string | null>(null);

  const { colorMode } = useColorMode();

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

  const openRecapModal = useOpenRecapModal();

  const initialValues = useMemo((): FormValues => {
    if (marking?.photoUrl && !photoSrc) setPhotoSrc(marking?.photoUrl);
    return {
      rating: marking?.rating || 3,
      comment: marking?.comment || "",
      photo: marking?.photoUrl || null,
      isPrivate: marking?.isPrivate || activeParticipation?.isPrivate || false,
    };
  }, [marking, photoSrc, activeParticipation]);

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
        const uploadData = await uploadImage(photo);
        photoUrl = uploadData.url;
      } catch (e) {
        setLoading(false);
        setError(`Jokin meni vikaan kuvan lisäyksessä: ${e.message}`);
        return;
      }
    }

    try {
      // User markings after edit/create. Set to null if update fails to not trigger update in global state.
      let newMarkings: Marking[] | null = null;
      let editedMarking: Marking | null = null;
      let editType: EditType;
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
        editType = "edit";
        if (result.data) {
          // Update edited marking if mutate returns data. User should always be defined here.
          editedMarking = result.data.editMarking;
          const editedMarkingIndex = activeParticipation.markings.findIndex(
            (it) => it.id === editedMarking?.id
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
        editType = "create";
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
        if (result.data) {
          editedMarking = result.data.addMarking;
          // Add created marking if mutate returns data. User should always be defined here.
          newMarkings = [...activeParticipation.markings, editedMarking];

          // If added marking is for the last day of the challenge, ask if user wants to see recap
          if (
            isSameDay(
              new Date(editedMarking.date),
              new Date(activeParticipation.challenge.endDate)
            )
          ) {
            openRecapModal(activeParticipation, user.name);
          }
        }
      }

      // Update user markings in frontend also, no need to refetch from backend
      if (newMarkings) updateActiveParticipationMarkings(newMarkings);
      if (onEdit && editedMarking) onEdit(editedMarking, editType);

      setLoading(false);
      disclosureProps.onClose();
    } catch (e) {
      if (photoUrl) {
        try {
          await deleteImage(photoUrl);
        } catch (deleteError) {
          setError(`Jokin meni pieleen kuvan poistossa ${deleteError.message}`);
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
        if (onEdit) onEdit(marking, "delete");
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

  const validateFile = (file: File | null): string => {
    // * 1024 * 1024 is for converting mb size to bytes, which file.size is in
    if (file && file.size > MAX_UPLOAD_FILE_SIZE_MB * 1024 * 1024) {
      return `Tiedosto saa olla enintään ${MAX_UPLOAD_FILE_SIZE_MB}MB kokoinen.`;
    }
    return "";
  };

  const validateAll = (values: FormValues): FormikErrors<FormValues> => {
    const errors: FormikErrors<FormValues> = {};
    if (values.rating <= 0) {
      errors.rating = "Anna arvostelu päivän suorituksesta";
    }
    if (typeof values.photo !== "string") {
      const fileError = validateFile(values.photo);
      if (fileError.length > 0) errors.photo = fileError;
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
        <Stack mb="3">
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
          validate={validateAll}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ values, setFieldValue, errors, setFieldError }) => (
            <Form>
              <Box mb="7">
                <FormLabel>Kuinka hyvin meni päivän setti</FormLabel>
                {[1, 2, 3, 4, 5].map((it) => (
                  <IconButton
                    key={it}
                    variant="ghost"
                    size="lg"
                    aria-label="Set rating value"
                    onClick={() => {
                      setFieldValue("rating", it);
                      setFieldError("rating", undefined);
                    }}
                    _hover={{
                      opacity: 1,
                    }}
                    onMouseEnter={() => setHoverRating(it)}
                    onMouseLeave={() => setHoverRating(0)}
                    icon={
                      <Icon
                        as={IoLeaf}
                        color={
                          (hoverRating > 0 && hoverRating < it) ||
                          (values.rating < it && hoverRating <= values.rating)
                            ? "gray.300"
                            : mode("primary.500", "primary.200")({ colorMode })
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
                as={Textarea}
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

              <Box mb="7">
                <ImageInput
                  id="photo"
                  accept="image/*"
                  buttonLabel="Valitse päivän kuva"
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
                mt={values.photo ? "3" : "0"}
              >
                <Text as="span" fontSize="sm">
                  Haluan piilottaa tämän merkkauksen muilta.
                </Text>
              </Checkbox>

              {error && <Text color="warning">{error}</Text>}
              <Box mt="3" mb="5">
                <Button
                  type="submit"
                  isLoading={loading || createLoading || updateLoading}
                  isDisabled={deleteLoading}
                  loadingText={marking ? "Tallenetaan..." : "Lisätään..."}
                  mr={3}
                >
                  {marking ? "Tallenna" : "Lisää merkkaus"}
                </Button>
                {marking && (
                  <ConfirmationModal
                    variant="delete"
                    onAccept={deleteAndClose}
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
                  </ConfirmationModal>
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
