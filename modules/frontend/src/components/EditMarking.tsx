import { FetchResult, useApolloClient } from "@apollo/client";
import {
  Checkbox,
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
import { PrimaryInput, PrimaryTextArea } from "components/primitives/Input";
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

const activityLabels = {
  meditation: "Meditaatio",
  yoga: "Jooga",
  reading: "Lukeminen",
  journaling: "Kirjottelu",
};

type EditMarkingProps = {
  modalTemplateProps?: Omit<ModalTemplateProps, "children">;
  marking?: Marking | null;
  date?: Date | null;
};

type FormValues = {
  activities: {
    meditation: boolean;
    yoga: boolean;
    reading: boolean;
    journaling: boolean;
  };
  comment: string;
  customActivity: string;
};

const defaultFormValues = {
  activities: {
    meditation: false,
    yoga: false,
    reading: false,
    journaling: false,
  },
  comment: "",
  customActivity: "",
};

const EditMarking = ({
  modalTemplateProps,
  marking,
  date,
}: EditMarkingProps): JSX.Element => {
  const [user, updateUser] = useGlobal(
    (state) => state.currentUser,
    (actions) => actions.updateUser
  );

  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues);
  const [isInitialStateSet, setIsInitialStateSet] = useState(false); // To check if initial state is set to avoid further re-renders
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Take disclosureProps if exist, otherwise empty obj so we can desctructure in next call
  const disclosureProps = modalTemplateProps?.disclosureProps
    ? modalTemplateProps?.disclosureProps
    : {};
  const { isOpen, onOpen, onClose } = useDisclosure({
    ...disclosureProps,
    onClose: () => {
      if (modalTemplateProps?.disclosureProps?.onClose) {
        modalTemplateProps?.disclosureProps?.onClose();
      }
      setIsInitialStateSet(false);
      setFormValues(defaultFormValues); // Reset formvalues on close
      console.log("Closing EditMarking and resetting form");
    },
  });

  const client = useApolloClient();

  useEffect(() => {
    console.log("Initial marking:", marking);
    console.log("Form values: ", formValues);

    // If marking is passed as prop, initialize form with it's values
    if (marking && !isInitialStateSet) {
      const newFormValues = {
        ...defaultFormValues,
      };

      // Set markings from marking data
      if (marking.activities) {
        marking.activities.forEach((it) => {
          // @ts-ignore
          if (formValues.activities[it] !== undefined)
            // @ts-ignore
            formValues.activities[it] = true;
        });
      }
      if (marking.comment) newFormValues.comment = marking.comment;
      console.log("Setting initial editMarking state:", newFormValues);

      setFormValues(newFormValues);
      setIsInitialStateSet(true); // Set that initialstate is changed, so this wont trigger again
    }
  }, [formValues, isInitialStateSet, marking]);

  const clearForm = () => {
    setFormValues(defaultFormValues);
  };

  const saveAndClose = async () => {
    setLoading(true);
    const { activities, comment, customActivity } = formValues;
    const checkedActivities = Object.keys(activities).filter(
      // @ts-ignore
      (it) => activities[it]
    );
    if (customActivity.length > 0) checkedActivities.push(customActivity);

    try {
      let editResult: Marking | null = null;
      // If marking exists, edit that
      if (marking) {
        const result: FetchResult<EditMarkingMutationResult> = await client.mutate(
          {
            mutation: EDIT_MARKING,
            variables: {
              id: marking.id,
              marking: {
                activities: checkedActivities,
                comment,
              },
            },
          }
        );
        if (result.data) editResult = result.data.editMarking;
      }
      // Otherwise create new marking
      else {
        const result: FetchResult<AddMarkingMutationResult> = await client.mutate(
          {
            mutation: ADD_MARKING,
            variables: {
              marking: {
                activities: checkedActivities,
                comment,
                date,
              },
              userName: user?.name || null,
            },
          }
        );
        if (result.data) editResult = result.data.addMarking;
      }

      // Update user markings in frontend also, no need to refetch from backend
      if (editResult && user) {
        updateUser({
          ...user,
          markings: [...user.markings, editResult],
        });
      }
      setLoading(false);
      onClose();
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
      onClose();
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
      disclosureProps={{ isOpen, onOpen, onClose }}
      openButtonProps={{ size: "md" }}
      modalFooter={
        <>
          {marking && (
            <AlertButton
              isLoading={loading}
              loadingText="Poista merkkaus"
              mr={3}
              onClick={deleteAndClose}
            >
              Poista
            </AlertButton>
          )}
          <PrimaryButton
            isLoading={loading}
            loadingText={marking ? "Tallenetaan..." : "Lisätään..."}
            mr={3}
            onClick={saveAndClose}
          >
            {marking ? "Tallenna" : "Lisää"}
          </PrimaryButton>
          {!loading && (
            <PrimaryButton mr={3} onClick={onClose}>
              Sulje
            </PrimaryButton>
          )}
        </>
      }
      {...modalTemplateProps}
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
          <FormLabel mb="0">Aamun aktiviteetti</FormLabel>
          {Object.keys(formValues.activities).map((key) => (
            <Checkbox
              key={key}
              // @ts-ignore
              value={formValues.activities[key]}
              // @ts-ignore
              isChecked={formValues.activities[key]}
              onChange={(event) => {
                const newActivities = { ...formValues.activities };
                // @ts-ignore
                newActivities[key] = event.target.checked;
                setFormValues({
                  ...formValues,
                  activities: newActivities,
                });
              }}
            >
              {
                // @ts-ignore
                activityLabels[key]
              }
            </Checkbox>
          ))}
        </Stack>
        <FormControl>
          <FormLabel id="customActivity">Oma uniikki aktiviteetti</FormLabel>
          <PrimaryInput
            placeholder="Slayer - Raining Blood kuunteleminen"
            type="text"
            value={formValues.customActivity}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFormValues({
                ...formValues,
                customActivity: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel id="comment">Kommentti</FormLabel>
          <PrimaryTextArea
            placeholder="Aamu meni ihan kivasti... vähän meinas demonit iskeä, mutta onneks löysin sisäisen Excaliburini ja karkotin ne takasin sinne, mihin kuuluvatkin!"
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
  modalTemplateProps: {},
  marking: undefined,
  date: undefined,
};

export default EditMarking;
