import {
  ApolloQueryResult,
  FetchResult,
  useApolloClient,
} from "@apollo/client";
import {
  Button,
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
import { AddMarkingMutationResult, ADD_MARKING } from "./queries";

const activityLabels = {
  meditation: "Meditaatio",
  yoga: "Jooga",
  reading: "Lukeminen",
  journaling: "Kirjottelu",
};

const AddMarking = (): JSX.Element => {
  const currentUser = localStorage.getItem("currentUser");
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
  const client = useApolloClient();

  const saveAndClose = async () => {
    const { activities, comment, customActivity } = formValues;
    const checkedActivities = Object.keys(activities).filter(
      // @ts-ignore
      (it) => activityLabels[it]
    );
    if (customActivity.length > 0) checkedActivities.push(customActivity);
    const result: FetchResult<AddMarkingMutationResult> = await client.mutate({
      mutation: ADD_MARKING,
      variables: {
        marking: {
          activities: checkedActivities,
          date: new Date().toString(),
          comment,
        },
        userName: currentUser,
      },
    });
    console.log(result);
    onClose();
  };

  return (
    <ModalTemplate
      openButtonLabel="Lisää merkkaus"
      headerLabel="Valinnaiset lisäkentät"
      disclosureProps={{ isOpen, onOpen, onClose }}
      openButtonProps={{ size: "md" }}
      modalFooter={
        <>
          <PrimaryButton mr={3} onClick={saveAndClose}>
            Tallenna
          </PrimaryButton>
          <PrimaryButton mr={3} onClick={onClose}>
            Sulje
          </PrimaryButton>
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
      </Stack>
    </ModalTemplate>
  );
};

export default AddMarking;
