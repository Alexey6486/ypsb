import {
  Button,
  PasswordInput,
  Input,
} from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { resetPasswordThunk, selectIsLoading } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';
import { validators } from '@utils/validators';

import type { TResetPasswordForm } from '@utils/types';
import type { FormEvent, JSX } from 'react';

export const ResetPasswordPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const isLoading = useSelector(selectIsLoading);

  const { values, handleChange, errors, isValid } =
    useFormWithValidation<TResetPasswordForm>({
      password: '',
      token: '',
    });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!isValid) return;
    void (async (): Promise<void> => {
      try {
        await dispatch(resetPasswordThunk(values)).unwrap();

        void navigation('/login');
      } catch (error: unknown) {
        console.log({ error });
      }
    })();
  };

  const handleToLogin = (): void => {
    void navigation('/login');
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="form-container">
      <div className="text text_type_main-medium mb-6">Восстановление пароля</div>
      <PasswordInput
        icon="ShowIcon"
        name="password"
        placeholder="Пароль"
        onChange={handleChange}
        value={values.password}
        errorText={!errors.password ? validators.password.message : ''}
        extraClass="mb-6"
      />
      <Input
        name="token"
        onChange={handleChange}
        placeholder="Введите код из письма"
        value={values.token}
        extraClass="mb-6"
      />
      <Button
        size="medium"
        type="primary"
        htmlType="submit"
        disabled={isLoading}
        extraClass="mb-20"
      >
        Сохранить
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
