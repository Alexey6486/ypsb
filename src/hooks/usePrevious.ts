import { useEffect, useRef } from 'react';

/**
 * Хук для отслеживания предыдущего значения между рендерами с возможностью
 * указания начального значения.
 *
 * @template T - Тип отслеживаемого значения
 * @param {T} value - Текущее значение для отслеживания
 * @param {T} [initialValue] - Опциональное начальное значение
 * @returns {T} Предыдущее значение (initialValue при первом рендере)
 *
 * @example
 * // Базовое использование без initialValue
 * const prevCount = usePrevious(count); // undefined при первом рендере
 *
 * @example
 * // С начальным значением
 * const prevUser = usePrevious(user, { id: 0, name: 'Гость' });
 *
 * @example
 * // Типизированный вариант
 * const prevValue = usePrevious<string>(value, 'default');
 */
export const usePrevious = <T>(value: T, initialValue?: T): T | undefined => {
  const ref = useRef<T | undefined>(initialValue);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
