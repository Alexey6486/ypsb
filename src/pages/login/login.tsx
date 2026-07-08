import {
  PasswordInput,
  EmailInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useLocation, useNavigate } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { loginThunk } from '@services/slices/user-slice';
import { useAppDispatch } from '@services/store';
import { validators } from '@utils/validators';

import type { TLoginForm, TLocationState } from '@utils/types';
import type { FormEvent, JSX } from 'react';

export const LoginPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation<TLocationState>();

  const { values, handleChange, errors, isValid } = useFormWithValidation<TLoginForm>({
    email: '',
    password: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!isValid) return;

    void (async (): Promise<void> => {
      try {
        await dispatch(loginThunk(values)).unwrap();

        const returnTo = (location as TLocationState).state?.from?.pathname;
        if (returnTo) {
          void navigate(returnTo, { replace: true });
        }
      } catch (error: unknown) {
        console.log({ error });
      }
    })();
  };

  const handleToRegister = (): void => {
    void navigate('/register');
  };

  const handleToReset = (): void => {
    void navigate('/forgot-password');
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
