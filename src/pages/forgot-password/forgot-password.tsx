import { EmailInput, Button } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { forgotPasswordThunk } from '@services/slices/user-slice';
import { useDispatch } from '@services/store';
import { validators } from '@utils/validators';

import type { TForgotPasswordForm } from '@utils/types';
import type { FormEvent, JSX } from 'react';

export const ForgotPasswordPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { values, handleChange, errors, isValid } =
    useFormWithValidation<TForgotPasswordForm>({
      email: '',
    });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!isValid) return;

    void (async (): Promise<void> => {
      try {
        await dispatch(forgotPasswordThunk(values)).unwrap();

        void navigate('/reset-password', {
          state: { from: { pathname: location?.pathname ?? '/forgot-password' } },
        });
      } catch (error: unknown) {
        console.log({ error });
      }
    })();
  };

  const handleToLogin = (): void => {
    void navigate('/login');
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="form-container">
      <div className="text text_type_main-medium mb-6">Восстановление пароля</div>
      <EmailInput
        name="email"
        onChange={handleChange}
        placeholder="Укажите e-mail"
        value={values.email}
        errorText={!errors.email ? validators.email.message : ''}
        extraClass="mb-6"
      />
      <Button size="medium" type="primary" htmlType="submit" extraClass="mb-20">
        Восстановить
      </Button>
      <div className="text text_type_main-default text_color_inactive">
        Вспомнили пароль?
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
