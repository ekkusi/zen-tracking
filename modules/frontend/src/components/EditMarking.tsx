import { FetchResult, useApolloClient } from "@apollo/client";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Marking } from "@ekeukko/zen-tracking-backend/lib/types/user";
import ModalTemplate, {
  ModalTemplateProps,
} from "components/general/ModalTemplate";
import { PrimaryButton, AlertButton } from "components/primitives/Button";
import { PrimaryTextArea } from "components/primitives/Input";
import React, { useEffect, useState } from "react";
import useGlobal from "store";
import DateUtil from "util/DateUtil";
import {
  AddMarkingMutationResult,
  ADD_MARKING,
  DeleteMarkingMutationResult,
  DELETE_MARKING,
  EditMarkingMutationResult,
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

const EditMarking = ({
  marking,
  date,
  ...modalTemplateProps
}: EditMarkingProps): JSX.Element => {
  const [user, updateUser] = useGlobal(
    (state) => state.currentUser,
    (actions) => actions.updateUser
  );

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
      setFormValues(newFormValues);
      setIsInitialStateSet(true); // Set that initialstate is changed, so this wont trigger again
    }
  }, [formValues, isInitialStateSet, marking]);

  const saveAndClose = async () => {
    setLoading(true);
    const { comment } = formValues;

    try {
      // User markings after edit/create. Set to null if update fails to not trigger update in global state.
      let newMarkings: Marking[] | null = null;
      // If marking exists, edit that
      if (marking) {
        const result: FetchResult<EditMarkingMutationResult> = await client.mutate(
          {
            mutation: EDIT_MARKING,
            variables: {
              id: marking.id,
              marking: {
                comment,
              },
            },
          }
        );
        if (result.data && user) {
          // Update edited marking if mutate returns data. User should always be defined here.
          const editedMarking = result.data.editMarking;
          const editedMarkingIndex = user.markings.findIndex(
            (it) => it.id === editedMarking.id
          );
          newMarkings = [...user.markings];
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
        const result: FetchResult<AddMarkingMutationResult> = await client.mutate(
          {
            mutation: ADD_MARKING,
            variables: {
              marking: {
                comment,
                date,
              },
              userName: user?.name || null,
            },
          }
        );
        if (result.data && user)
          // Add created marking if mutate returns data. User should always be defined here.
          newMarkings = [...user.markings, result.data.addMarking];
      }

      // Update user markings in frontend also, no need to refetch from backend
      if (newMarkings && user) {
        updateUser({
          ...user,
          markings: newMarkings,
        });
      }
      setLoading(false);
      disclosureProps.onClose();
    } catch (e) {
      setLoading(false);
      setError(`Jokin meni vikaan merkkauksen muokkauksessa: ${e.message}`);
    }
  };

  const deleteAndClose = async () => {
    setLoading(true);

    try {
      if (marking) {
        const {
          data,
        }: FetchResult<DeleteMarkingMutationResult> = await client.mutate({
          mutation: DELETE_MARKING,
          variables: {
            id: marking.id,
          },
        });
        if (data && user) {
          // Delete marking from user in frontend also, no need to refetch from backend
          updateUser({
            ...user,
            markings: user.markings.filter((it) => it.id !== marking.id),
          });
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFormValues({
                ...formValues,
                comment: event.target.value,
              })
            }
          />
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
