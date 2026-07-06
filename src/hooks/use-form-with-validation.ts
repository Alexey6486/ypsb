import { type ChangeEvent, useState } from 'react';

import { validators } from '@utils/validators';

export const useFormWithValidation = <T>(
  initialValues: T,
  isValidOnInit?: boolean
): {
  values: T;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleReset: (values: T) => void;
  errors: Record<string, boolean>;
  isValid: boolean;
} => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, boolean>>(
    initErrors(initialValues, isValidOnInit)
  );
  const [isValid, setIsValid] = useState<boolean>(false);

  function handleReset(values: T): void {
    setValues(values);
    setErrors(initErrors(values, isValidOnInit));
    setIsValid(false);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const input = event.target;
    const value = input.value;
    const name = input.name;

    const newValues = {
      ...values,
      [name]: value,
    };

    setValues(newValues);

    const newErrors = {
      ...errors,
      [name]: validators[name]?.validator(value) ?? true,
    };

    setErrors(newErrors);

    const formIsNotValid = Object.values(newErrors).some((x) => !x);

    setIsValid(!formIsNotValid);
  }

  return { values, handleChange, errors, isValid, handleReset };
};

function initErrors<T>(formValues: T, isValidOnInit?: boolean): Record<string, boolean> {
  return Object.keys(formValues).reduce((errors, fieldName) => {
    errors[fieldName] = Boolean(isValidOnInit);
    return errors;
  }, {});
}
