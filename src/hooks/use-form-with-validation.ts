import { type ChangeEvent, useState } from 'react';

import { validators } from '@utils/validators.js';

export const useFormWithValidation = <T>(
  initialValues: T
): {
  values: T;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, boolean>;
  isValid: boolean;
} => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, boolean>>(
    initErrors(initialValues)
  );
  const [isValid, setIsValid] = useState<boolean>(false);

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

  return { values, handleChange, errors, isValid };
};

function initErrors<T>(formValues: T): Record<string, boolean> {
  return Object.keys(formValues).reduce((errors, fieldName) => {
    errors[fieldName] = false;
    return errors;
  }, {});
}
