import { gql, useMutation } from "@apollo/client";
import { Button, Checkbox, Text, useDisclosure } from "@chakra-ui/react";
import { Form, Formik, FormikErrors } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import { setAccessToken } from "../../util/accessToken";
import useGlobal from "../../store";
import FormField from "../general/form/FormField";
import ModalTemplate, { ModalTemplateProps } from "../general/ModalTemplate";
import {
  RegisterMutation,
  RegisterMutationVariables,
} from "./__generated__/RegisterMutation";
import { userDataFragment } from "../../fragments";
import { ParsedUser } from "../../types/parsedBackendTypes";
import Heading from "../primitives/Heading";
import { EditUser, EditUserVariables } from "./__generated__/EditUser";

export const REGISTER_USER = gql`
  mutation RegisterMutation(
    $name: ID!
    $password: String!
    $isPrivate: Boolean!
    $email: String
  ) {
    register(
      name: $name
      password: $password
      email: $email
      isPrivate: $isPrivate
    ) {
      accessToken
      user {
        ...UserData
      }
    }
  }
  ${userDataFragment}
`;

export const EDIT_USER = gql`
  mutation EditUser(
    $nameInput: NameInput!
    $passwordInput: PasswordInput
    $email: String
    $isPrivate: Boolean
  ) {
    editUser(
      nameInput: $nameInput
      passwordInput: $passwordInput
      email: $email
      isPrivate: $isPrivate
    ) {
      accessToken
      user {
        ...UserData
      }
    }
  }
  ${userDataFragment}
`;

type UserEditModalProps = Omit<ModalTemplateProps, "children"> & {
  onEdit?: (editedUser: ParsedUser) => void;
  user?: ParsedUser;
};

type FormValues = {
  name: string;
  email: string;
  currentPassword: string;
  password: string;
  reEnteredPassword: string;
  isPrivate: boolean;
};

const UserEditModal = ({
  user,
  onEdit,
  isOpen: customIsOpen,
  onClose: customOnClose,
  ...modalTemplateProps
}: UserEditModalProps): JSX.Element => {
  const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore");
  const globalActions = useGlobal()[1];
  const [register, { loading: registerLoading }] = useMutation<
    RegisterMutation,
    RegisterMutationVariables
  >(REGISTER_USER);

  const [editUser, { loading: editLoading }] = useMutation<
    EditUser,
    EditUserVariables
  >(EDIT_USER);

  const disclosureProps = useDisclosure({
    isOpen: customIsOpen,
    onClose: customOnClose,
  });

  const history = useHistory();

  const validateName = (name: string) => {
    let error;
    if (name.length === 0) error = "Tunnus ei voi olla tyhjä";
    return error;
  };

  const validatePassword = (password: string) => {
    let error;
    if (!user && password.length === 0) error = "Salasana ei voi olla tyhjä";
    return error;
  };

  const validatePasswords = ({
    password,
    reEnteredPassword,
  }: FormValues): FormikErrors<FormValues> => {
    const errors: FormikErrors<FormValues> = {};
    // If is edit mode, only check passwords if user has input new password. Always check in register.
    if ((user && password.length > 0) || !user) {
      if (password !== reEnteredPassword) {
        errors.password = "Salasanat eivät täsmää";
        errors.reEnteredPassword = "Salasanat eivät täsmää";
      }
    }

    return errors;
  };

  const registerAndClose = async (values: FormValues) => {
    if (user) {
      // Edit user
      const { email, name, password, currentPassword, isPrivate } = values;
      const input = {
        nameInput: { currentName: user.name, newName: name },
        passwordInput: password
          ? { newPassword: password, currentPassword }
          : undefined,
        email: email || undefined,
        isPrivate,
      };
      // alert(JSON.stringify(input));
      const { data } = await editUser({
        variables: input,
      });
      if (data) {
        const { accessToken, user: editedUser } = data.editUser;
        globalActions.updateUser(editedUser);
        setAccessToken(accessToken);
        if (onEdit) onEdit(editedUser);
        disclosureProps.onClose();
      }
    } else {
      const { email, currentPassword, reEnteredPassword, ...input } = values;
      const { data } = await register({
        variables: {
          ...input,
          email: email || undefined,
        },
      });
      if (data) {
        const { accessToken, user: registeredUser } = data.register;
        if (!hasLoggedInBefore)
          localStorage.setItem("hasLoggedInBefore", "true");
        globalActions.updateUser(registeredUser);
        setAccessToken(accessToken);
        history.push("/welcome-user");

        if (onEdit) onEdit(registeredUser);
        disclosureProps.onClose();
      }
    }
  };

  return (
    <ModalTemplate
      openButtonLabel={user ? "Muokkaa tietojasi" : "Rekisteröidy"}
      headerLabel={user ? "Muokkaa tietojasi" : "Rekisteröidy"}
      hasFooter={false}
      {...modalTemplateProps}
      {...disclosureProps}
    >
      <Formik
        initialValues={{
          name: user ? user.name : "",
          email: user?.email ? user.email : "",
          currentPassword: "",
          password: "",
          reEnteredPassword: "",
          isPrivate: user?.isPrivate ? user.isPrivate : false,
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
              name="email"
              type="email"
              label={user ? "Sähköposti" : "Sähköposti (valinnainen)"}
              placeholder="ukkeli@email.com"
            />
            {user && (
              <>
                <Heading.H3 mb="4">Salasanan vaihto</Heading.H3>
                <FormField
                  name="currentPassword"
                  type="password"
                  label="Nykyinen salasana"
                  placeholder="*********"
                  validate={validatePassword}
                />
              </>
            )}
            <FormField
              name="password"
              type="password"
              label={user ? "Uusi salasana" : "Salasana"}
              placeholder="*********"
              validate={validatePassword}
            />
            <FormField
              name="reEnteredPassword"
              type="password"
              label={
                user
                  ? "Syötä uusi salasana uudelleen"
                  : "Syötä salasana uudelleen"
              }
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

            <Button
              type="submit"
              isLoading={registerLoading || editLoading}
              isDisabled={registerLoading || editLoading}
              loadingText="Tallennetaan"
            >
              {user ? "Tallenna" : "Rekisteröidy"}
            </Button>
          </Form>
        )}
      </Formik>
    </ModalTemplate>
  );
};

export default UserEditModal;
