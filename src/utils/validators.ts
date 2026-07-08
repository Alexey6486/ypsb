const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const NAME_REGEX = /^[A-Za-zА-Яа-яЁё0-9\s-]{2,}$/;

export const validators: Record<
  string,
  { validator: (value: string) => boolean; message: string; isRequired: boolean }
> = {
  name: {
    validator: (value) => NAME_REGEX.test(value.trim()),
    message: 'Укажите корректное имя.',
    isRequired: true,
  },
  email: {
    validator: (value) => EMAIL_REGEX.test(value.trim()),
    message: 'Укажите корректный email.',
    isRequired: true,
  },
  password: {
    validator: (value) => PWD_REGEX.test(value.trim()),
    message: 'Укажите пароль посложнее.',
    isRequired: true,
  },
  newPassword: {
    validator: (value) => PWD_REGEX.test(value.trim()),
    message: 'Укажите пароль посложнее.',
    isRequired: false,
  },
};
