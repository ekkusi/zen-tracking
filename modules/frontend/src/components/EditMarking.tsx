import { useApolloClient } from "@apollo/client";
import {
  Box,
  FormControl,
  FormLabel,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Marking } from "@ekeukko/zen-tracking-backend/lib/types/schema";
import ModalTemplate, {
  ModalTemplateProps,
} from "components/general/ModalTemplate";
import { PrimaryButton, AlertButton } from "components/primitives/Button";
import { PrimaryTextArea } from "components/primitives/Input";
import React, { useEffect, useRef, useState } from "react";
import useGlobal from "store";
import DateUtil from "util/DateUtil";
import {
  AddMarkingMutation,
  AddMarkingMutationVariables,
} from "views/main/__generated__/AddMarkingMutation";
import {
  DeleteMarkingMutation,
  DeleteMarkingMutationVariables,
} from "views/main/__generated__/DeleteMarkingMutation";
import {
  EditMarkingMutation,
  EditMarkingMutationVariables,
} from "views/main/__generated__/EditMarkingMutation";
import {
  ADD_MARKING,
  DELETE_MARKING,
  EDIT_MARKING,
} from "../views/main/queries";

type EditMarkingProps = Omit<ModalTemplateProps, "children"> & {
  marking?: Marking | null;
  date?: Date | null;
};

type FormValues = {
  comment: string;
};

const defaultFormValues: FormValues = {
  comment: "",
};

const MAX_COMMENT_LENGTH = 2000;

const EditMarking = ({
  marking,
  date,
  ...modalTemplateProps
}: EditMarkingProps): JSX.Element => {
  const unmounted = useRef(false);
  const [activeParticipation, updateActiveParticipationMarkings] = useGlobal(
    (state) => state.activeParticipation,
    (actions) => actions.updateActiveParticipationMarkings
  );
  const updateError = useGlobal(
    (state) => state.error,
    (actions) => actions.updateError
  )[1];

  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues);
  const [isInitialStateSet, setIsInitialStateSet] = useState(false); // To check if initial state is set to avoid further re-renders
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const disclosureProps = useDisclosure({
    isOpen: modalTemplateProps.isOpen,
    onOpen: modalTemplateProps.onOpen,
    onClose: () => {
      if (modalTemplateProps.onClose) {
        modalTemplateProps.onClose();
      }
      setError(undefined);
      setIsInitialStateSet(false);
      setFormValues(defaultFormValues); // Reset formvalues on close
    },
  });

  const client = useApolloClient();

  useEffect(() => {
    // If marking is passed as prop, initialize form with it's values
    if (marking && !isInitialStateSet) {
      const newFormValues = {
        ...defaultFormValues,
      };
      if (marking.comment) newFormValues.comment = marking.comment;
      if (!unmounted.current) {
        setFormValues(newFormValues);
        setIsInitialStateSet(true); // Set that initialstate is changed, so this wont trigger again
      }
    }
    return () => {
      unmounted.current = true;
    };
  }, [formValues, isInitialStateSet, marking]);

  const updateFormValues = (values: FormValues) => {
    setFormValues(values);
  };

  const saveAndClose = async () => {
    // This shouldn't get triggered, activeParticipation should be found if EditMarking is open
    if (!activeParticipation) {
      updateError(
        "Ei voida tallentaa merkkausta, koska nykyistä haastetta ei ole valittuna"
      );
      return;
    }

    setLoading(true);
    const { comment } = formValues;

    try {
      // User markings after edit/create. Set to null if update fails to not trigger update in global state.
      let newMarkings: Marking[] | null = null;
      // If marking exists, edit that
      if (marking) {
        const result = await client.mutate<
          EditMarkingMutation,
          EditMarkingMutationVariables
        >({
          mutation: EDIT_MARKING,
          variables: {
            id: marking.id,
            marking: {
              comment,
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
        const result = await client.mutate<
          AddMarkingMutation,
          AddMarkingMutationVariables
        >({
          mutation: ADD_MARKING,
          variables: {
            marking: {
              comment,
              date,
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
        const { data } = await client.mutate<
          DeleteMarkingMutation,
          DeleteMarkingMutationVariables
        >({
          mutation: DELETE_MARKING,
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

  return (
    <ModalTemplate
      openButtonLabel="Lisää merkkaus"
      headerLabel={marking ? "Muokataan merkkausta" : "Lisää merkkaus"}
      openButtonProps={{ size: "md" }}
      modalBodyProps={{ pt: "0" }}
      modalFooterProps={{ justifyContent: "flex-start" }}
      modalFooter={
        <>
          <PrimaryButton
            isLoading={loading}
            loadingText={marking ? "Tallenetaan..." : "Lisätään..."}
            mr={3}
            onClick={saveAndClose}
          >
            {marking ? "Tallenna" : "Lisää"}
          </PrimaryButton>
          {marking ? (
            <AlertButton
              isLoading={loading}
              loadingText="Poista merkkaus"
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
        <FormControl pt="0">
          <FormLabel id="comment">
            Valinnainen kommentti päivän suorituksesta
          </FormLabel>
          <PrimaryTextArea
            placeholder="Päivä meni ihan kivasti... vähän meinas demonit iskeä, mutta onneks löysin sisäisen Excaliburini ja karkotin ne takasin syövereihinsä:)"
            type="text"
            value={formValues.comment}
            maxLength={MAX_COMMENT_LENGTH}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateFormValues({
                ...formValues,
                comment: event.target.value,
              })
            }
          />
          <Text as="span" display="block" color="secondary" fontSize="sm">
            {formValues.comment.length}/{MAX_COMMENT_LENGTH} merkkiä
          </Text>
        </FormControl>
        {error && <Text color="warning">{error}</Text>}
      </Stack>
    </ModalTemplate>
  );
};

EditMarking.defaultProps = {
  marking: undefined,
  date: undefined,
};

export default EditMarking;
