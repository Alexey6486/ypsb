import {
  PasswordInput,
  EmailInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { loginThunk } from '@services/slices/user-slice';
import { useDispatch } from '@services/store';
import { validators } from '@utils/validators';

import type { TLoginForm } from '@utils/types';
import type { FormEvent, JSX } from 'react';

export const LoginPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const { values, handleChange, errors, isValid } = useFormWithValidation<TLoginForm>({
    email: '',
    password: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!isValid) return;
    void dispatch(loginThunk(values));
  };

  const handleToRegister = (): void => {
    void navigation('/register');
  };

  const handleToReset = (): void => {
    void navigation('/forgot-password');
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="form-container">
      <div className="text text_type_main-medium mb-6">Вход</div>
      <EmailInput
        name="email"
        onChange={handleChange}
        placeholder="E-mail"
        value={values.email}
        errorText={!errors.email ? validators.email.message : ''}
        extraClass="mb-6"
      />
      <PasswordInput
        icon="ShowIcon"
        name="password"
        placeholder="Пароль"
        onChange={handleChange}
        value={values.password}
        errorText={!errors.password ? validators.password.message : ''}
        extraClass="mb-6"
      />
      <Button size="medium" type="primary" htmlType="submit" extraClass="mb-20">
        Войти
      </Button>
      <div className="text text_type_main-default text_color_inactive">
        Вы — новый пользователь?
        <Button
          onClick={handleToRegister}
          size="medium"
          type="secondary"
          htmlType="button"
          extraClass="p-2"
        >
          Зарегистрироваться
        </Button>
      </div>
      <div className="text text_type_main-default text_color_inactive">
        Забыли пароль?
        <Button
          onClick={handleToReset}
          size="medium"
          type="secondary"
          htmlType="button"
          extraClass="p-2"
        >
          Восстановить пароль
        </Button>
      </div>
    </form>
  );
};
