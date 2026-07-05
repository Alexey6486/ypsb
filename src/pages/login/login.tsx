import {
  PasswordInput,
  EmailInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { loginThunk, selectIsLoading } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';
import { validators } from '@utils/validators';

import type { TLoginForm } from '@utils/types';
import type { FormEvent, JSX } from 'react';

export const LoginPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const { values, handleChange, errors, isValid } = useFormWithValidation<TLoginForm>({
    email: '',
    password: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!isValid) return;
    void dispatch(loginThunk(values));
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="form-container">
      <div className="text text_type_main-medium mb-6">Вход</div>
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
        name="password"
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
        Войти
      </Button>
      <div className="text text_type_main-default text_color_inactive">
        Вы — новый пользователь?
        <Button
          onClick={() => null}
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
          onClick={() => null}
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
