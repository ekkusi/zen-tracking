import { FetchResult, useApolloClient } from "@apollo/client";
import {
  Checkbox,
  FormControl,
  FormLabel,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import ModalTemplate from "components/ModalTemplate";
import { PrimaryButton } from "components/primitives/Button";
import { PrimaryInput, PrimaryTextArea } from "components/primitives/Input";
import React, { useState } from "react";
import useGlobal from "store";
import { AddMarkingMutationResult, ADD_MARKING } from "./queries";

const activityLabels = {
  meditation: "Meditaatio",
  yoga: "Jooga",
  reading: "Lukeminen",
  journaling: "Kirjottelu",
};

const AddMarking = (): JSX.Element => {
  const [user, updateUser] = useGlobal(
    (state) => state.currentUser,
    (actions) => actions.updateUser
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formValues, setFormValues] = useState({
    activities: {
      meditation: false,
      yoga: false,
      reading: false,
      journaling: false,
    },
    comment: "",
    customActivity: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const client = useApolloClient();

  const saveAndClose = async () => {
    setLoading(true);
    const { activities, comment, customActivity } = formValues;
    const checkedActivities = Object.keys(activities).filter(
      // @ts-ignore
      (it) => activityLabels[it]
    );
    if (customActivity.length > 0) checkedActivities.push(customActivity);

    try {
      const {
        data,
      }: FetchResult<AddMarkingMutationResult> = await client.mutate({
        mutation: ADD_MARKING,
        variables: {
          marking: {
            activities: checkedActivities,
            date: new Date().toString(),
            comment,
          },
          userName: "tere",
        },
      });
      if (data && user) {
        updateUser({
          ...user,
          markings: [...user.markings, data.addMarking],
        });
      }
      setLoading(false);

      onClose();
    } catch (e) {
      setLoading(false);
      setError("Jokin meni vikaan merkkauksen lisäämisessä");
    }
  };

  return (
    <ModalTemplate
      openButtonLabel="Lisää merkkaus"
      headerLabel="Valinnaiset lisäkentät"
      disclosureProps={{ isOpen, onOpen, onClose }}
      openButtonProps={{ size: "md" }}
      modalFooter={
        <>
          <PrimaryButton
            isLoading={loading}
            loadingText="Lisätään merkkausta"
            mr={3}
            onClick={saveAndClose}
          >
            Lisää
          </PrimaryButton>
          {!loading && (
            <PrimaryButton mr={3} onClick={onClose}>
              Sulje
            </PrimaryButton>
          )}
        </>
      }
    >
      <Stack pt="0">
        <Stack>
          <FormLabel mb="0">Aamun aktiviteetti</FormLabel>
          {Object.keys(formValues.activities).map((key) => (
            <Checkbox
              key={key}
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

export default AddMarking;
