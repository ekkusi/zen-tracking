import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormLabel,
  FormLabelProps,
  Input,
  InputProps,
} from "@chakra-ui/react";
import {
  Field,
  FieldConfig,
  GenericFieldHTMLAttributes,
  useField,
} from "formik";
import React from "react";

type FormFieldProps<Val = string> = GenericFieldHTMLAttributes &
  FieldConfig<Val> & {
    label: string;
    inputProps?: InputProps;
    labelProps?: FormLabelProps;
    containerProps?: FormControlProps;
    errorMessageProps?: FormErrorMessageProps;
    children?: JSX.Element;
  };

const FormField = ({
  label,
  inputProps,
  labelProps,
  containerProps,
  errorMessageProps,
  validate,
  children,
  as = Input,
  ...rest
}: FormFieldProps): JSX.Element => {
  const [{ onChange, onBlur, ...field }, meta, helpers] = useField({
    validate,
    ...rest,
  });
  const validateField = (value: string) => {
    if (validate) {
      const error = validate(value);
      if (error && typeof error === "string") {
        helpers.setError(error);
      } else {
        helpers.setError("");
      }
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChange(event);
    validateField(value); // set / clear error message
  };
  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setTouched(true);

    // validate local field only
    validateField(event.target.value);
  };
  return (
    <FormControl
      isInvalid={!!meta.error && meta.touched}
      mb="4"
      {...containerProps}
    >
      <FormLabel htmlFor={rest.name} {...labelProps}>
        {label}
      </FormLabel>
      <Field
        as={as}
        {...rest}
        {...field}
        {...inputProps}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {children}
      <FormErrorMessage {...errorMessageProps}>
        {meta.error || "terve"}
      </FormErrorMessage>
    </FormControl>
  );
};

export default FormField;
