import { gql, useMutation } from "@apollo/client";
import { Checkbox, Text, useDisclosure } from "@chakra-ui/react";
import { Form, Formik, FormikErrors } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import { setAccessToken } from "../util/accessToken";
import useGlobal from "../store";
import FormField from "./general/form/FormField";
import ModalTemplate, { ModalTemplateProps } from "./general/ModalTemplate";
import { PrimaryButton } from "./primitives/Button";
import {
  RegisterMutation,
  RegisterMutationVariables,
} from "./__generated__/RegisterMutation";
import { userDataFragment } from "../fragments";

export const REGISTER_USER = gql`
  mutation RegisterMutation(
    $name: ID!
    $password: String!
    $isPrivate: Boolean!
  ) {
    register(name: $name, password: $password, isPrivate: $isPrivate) {
      accessToken
      user {
        ...UserData
      }
    }
  }
  ${userDataFragment}
`;

type RegisterModalProps = Omit<ModalTemplateProps, "children"> & {};

type FormValues = {
  name: string;
  password: string;
  reEnteredPassword: string;
  isPrivate: boolean;
};

const RegisterModal = ({
  ...modalTemplateProps
}: RegisterModalProps): JSX.Element => {
  const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore");
  const globalActions = useGlobal()[1];
  const [register, { loading }] = useMutation<
    RegisterMutation,
    RegisterMutationVariables
  >(REGISTER_USER);

  const disclosureProps = useDisclosure();

  const history = useHistory();

  const validateName = (name: string) => {
    let error;
    if (name.length === 0) error = "Tunnus ei voi olla tyhjä";
    return error;
  };

  const validatePassword = (password: string) => {
    let error;
    if (password.length === 0) error = "Salasana ei voi olla tyhjä";
    return error;
  };

  const validatePasswords = ({
    password,
    reEnteredPassword,
  }: FormValues): FormikErrors<FormValues> => {
    const errors: FormikErrors<FormValues> = {};
    if (password !== reEnteredPassword) {
      errors.password = "Salasanat eivät täsmää";
      errors.reEnteredPassword = "Salasanat eivät täsmää";
    }

    return errors;
  };
  const registerAndClose = async (values: FormValues) => {
    const { data } = await register({
      variables: values,
    });
    if (data) {
      const { accessToken, user } = data.register;
      if (!hasLoggedInBefore) localStorage.setItem("hasLoggedInBefore", "true");
      globalActions.updateUser(user);
      setAccessToken(accessToken);
      history.push("/welcome-user");
      disclosureProps.onClose();
    }
  };
  return (
    <ModalTemplate
      openButtonLabel="Rekisteröidy"
      headerLabel="Rekisteröidy"
      hasFooter={false}
      {...modalTemplateProps}
      {...disclosureProps}
    >
      <Formik
        initialValues={{
          name: "",
          password: "",
          reEnteredPassword: "",
          isPrivate: false,
        }}
        validate={validatePasswords}
        onSubmit={registerAndClose}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <FormField
              name="name"
              type="text"
              validate={validateName}
              label="Tunnus"
              placeholder="tunnus"
            />
            <FormField
              name="password"
              type="password"
              label="Salasana"
              placeholder="*********"
              validate={validatePassword}
            />
            <FormField
              name="reEnteredPassword"
              type="password"
              label="Syötä salasana uudelleen"
              validate={validatePassword}
              placeholder="*********"
            />
            <Checkbox
              isChecked={values.isPrivate}
              onChange={(event) =>
                setFieldValue("isPrivate", event.target.checked)
              }
              mb="4"
            >
              <Text as="span" fontSize="sm">
                Haluan pitää tietoni piilossa muilta kanssazenittäjiltä.
              </Text>
            </Checkbox>

            <PrimaryButton
              type="submit"
              isLoading={loading}
              isDisabled={loading}
              loadingText="Rekisteröidytään"
            >
              Rekisteröidy
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </ModalTemplate>
  );
};

export default RegisterModal;
