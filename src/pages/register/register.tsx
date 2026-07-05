import {
  PasswordInput,
  EmailInput,
  Input,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { registerThunk, selectIsLoading } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';
import { validators } from '@utils/validators';

import type { TRegisterForm } from '@utils/types';
import type { FormEvent, JSX } from 'react';

export const RegisterPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const isLoading = useSelector(selectIsLoading);

  const { values, handleChange, errors, isValid } = useFormWithValidation<TRegisterForm>(
    {
      name: '',
      email: '',
      password: '',
    }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!isValid) return;
    void dispatch(registerThunk(values));
  };

  const handleToLogin = (): void => {
    void navigation('/login');
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="form-container">
      <div className="text text_type_main-medium mb-6">Регистрация</div>
      <Input
        name="name"
        onChange={handleChange}
        placeholder="Имя"
        value={values.name}
        errorText={!errors.name ? validators.name.message : ''}
        extraClass="mb-6"
      />
      <EmailInput
        name="email"
        onChange={handleChange}
        placeholder="email"
        value={values.email}
        errorText={!errors.email ? validators.email.message : ''}
        extraClass="mb-6"
      />
      <PasswordInput
        icon="ShowIcon"
        name="Пароль"
        onChange={handleChange}
        value={values.password}
        errorText={!errors.password ? validators.password.message : ''}
        extraClass="mb-6"
      />
      <Button
        size="medium"
        type="primary"
        htmlType="submit"
        disabled={isLoading}
        extraClass="mb-20"
      >
        Зарегистрироваться
      </Button>
      <div className="text text_type_main-default text_color_inactive">
        Уже зарегистрированы?
        <Button
          onClick={handleToLogin}
          size="medium"
          type="secondary"
          htmlType="button"
          extraClass="p-2"
        >
          Войти
        </Button>
      </div>
    </form>
  );
};
