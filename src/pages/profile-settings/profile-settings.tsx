import { Input, Button } from '@krgaa/react-developer-burger-ui-components';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { selectUser, editUserThunk } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';
import { validators } from '@utils/validators';

import type { TRegisterForm, TUser } from '@utils/types';
import type { JSX, FormEvent } from 'react';

import styles from './profile-settings.module.css';

const checkChanges = (prev: TUser | null, form: TRegisterForm): boolean => {
  if (!prev) {
    return false;
  }

  const { name: prevName, email: prevEmail } = prev;
  const { name: newName, email: newEmail } = form;

  return !!(prevName !== newName || prevEmail !== newEmail || form.password.length);
};

export const ProfileSettingsPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const { values, handleChange, errors, isValid, handleReset } =
    useFormWithValidation<TRegisterForm>(
      {
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
      },
      false
    );

  const isChanged = checkChanges(user, values);
  console.log({ isChanged, user, values, errors, isValid });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log(1, { isChanged, user, values, errors, isValid });
    if (!isValid) return;
    console.log(2, { isChanged, user, values, errors, isValid });
    void dispatch(editUserThunk(values));
  };

  const handleCancel = (): void => {
    handleReset({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Input
        icon="EditIcon"
        name="name"
        onChange={handleChange}
        placeholder="Имя"
        value={values.name}
        errorText={!errors.name ? validators.name.message : ''}
        extraClass="mb-6"
      />
      <Input
        icon="EditIcon"
        name="email"
        onChange={handleChange}
        placeholder="Логин"
        type="email"
        value={values.email}
        errorText={!errors.email ? validators.email.message : ''}
        extraClass="mb-6"
      />
      <Input
        icon="EditIcon"
        name="password"
        onChange={handleChange}
        placeholder="Пароль"
        type="password"
        value={values.password}
        errorText={!errors.password ? validators.password.message : ''}
        extraClass="mb-6"
      />
      {isChanged && (
        <div className={styles.buttons}>
          <Button onClick={handleCancel} size="large" type="secondary" htmlType="button">
            Отмена
          </Button>
          <Button onClick={handleSubmit} size="large" type="primary" htmlType="submit">
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};
