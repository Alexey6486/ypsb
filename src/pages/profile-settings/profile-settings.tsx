import { Input, Button } from '@krgaa/react-developer-burger-ui-components';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { selectUser, editUserThunk } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';
import { validators } from '@utils/validators';

import type { TProfileSettingsForm, TUser } from '@utils/types';
import type { JSX, FormEvent } from 'react';

import styles from './profile-settings.module.css';

const checkChanges = (prev: TUser | null, form: TProfileSettingsForm): boolean => {
  if (!prev) {
    return false;
  }

  const { name: prevName, email: prevEmail } = prev;
  const { name: newName, email: newEmail } = form;

  return !!(prevName !== newName || prevEmail !== newEmail || form.newPassword.length);
};

export const ProfileSettingsPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const { values, handleChange, errors, isValid, handleReset } =
    useFormWithValidation<TProfileSettingsForm>(
      {
        name: user?.name ?? '',
        email: user?.email ?? '',
        newPassword: '',
      },
      true
    );

  const isChanged = checkChanges(user, values);

  const handleResetForm = (): void => {
    handleReset({
      name: user?.name ?? '',
      email: user?.email ?? '',
      newPassword: '',
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!isValid) return;

    void (async (): Promise<void> => {
      try {
        const { name, email, newPassword } = values;
        await dispatch(
          editUserThunk({
            name,
            email,
            password: newPassword,
          })
        ).unwrap();

        handleReset({
          name,
          email,
          newPassword: '',
        });
      } catch (error: unknown) {
        console.log({ error });
      }
    })();
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
        name="newPassword"
        onChange={handleChange}
        placeholder="Пароль"
        type="password"
        value={values.newPassword}
        errorText={!errors.newPassword ? validators.newPassword.message : ''}
        extraClass="mb-6"
      />
      {isChanged && (
        <div className={styles.buttons}>
          <Button
            onClick={handleResetForm}
            size="large"
            type="secondary"
            htmlType="button"
          >
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
