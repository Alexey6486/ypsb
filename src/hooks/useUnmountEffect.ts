import { useEffect } from 'react';

/**
 * Хук для выполнения функции при размонтировании компонента.
 *
 * Используется для очистки ресурсов или выполнения побочных эффектов,
 * которые должны произойти только при размонтировании.
 *
 * @param fn - Функция, которая будет вызвана при размонтировании компонента.
 *
 * @example
 * useUnmountEffect(() => {
 *   console.log('Компонент размонтирован')
 *   clearInterval(timerId)
 * })
 */
export const useUnmountEffect = (fn: () => void): void => {
  useEffect(() => {
    return (): void => {
      fn();
    };
  }, []);
};
