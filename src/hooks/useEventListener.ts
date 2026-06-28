import { useEffect, useRef, useCallback, type RefObject } from 'react';

import { usePrevious } from './usePrevious';
import { useUnmountEffect } from './useUnmountEffect';

/**
 * Типы параметров для опций addEventListener.
 */
type EventListenerOptions = boolean | AddEventListenerOptions;

/**
 * Тип цели, к которой можно привязать обработчик событий.
 */
type Target =
  | string
  | EventTarget
  | HTMLElement
  | RefObject<EventTarget>
  | RefObject<HTMLElement | null>
  | null
  | PointerEvent;

/**
 * Параметры, передаваемые в хук `useEventListener`.
 */
type UseEventListenerProps = {
  /** Цель, на которую вешается обработчик события. По умолчанию `document`. */
  target?: Target;
  /** Тип события (например, `'click'`, `'keydown'` и т.п.). */
  type: string;
  /** Обработчик события. */
  listener: EventListener;
  /** Опции, передаваемые в `addEventListener`. */
  options?: EventListenerOptions;
  /** Управляет тем, должен ли обработчик быть активен. По умолчанию `true`. */
  when?: boolean;
};

/**
 * Разрешает значение `target` до конкретного `EventTarget` (например, `window`, `document`, DOM-элемент и т.д.).
 *
 * @param target Цель, к которой привязывается обработчик.
 * @returns Объект `EventTarget` или `null`, если цель не может быть разрешена.
 */
function resolveTarget(target?: Target): EventTarget | null {
  if (typeof window === 'undefined') return null;
  if (!isDefined(target)) return null;

  if (target === 'window') return window;
  if (target === 'document') return document;
  if (typeof target === 'string') return document.querySelector(target);
  if (target !== null && typeof target === 'object' && 'current' in target) {
    return target.current;
  }
  if (target instanceof EventTarget) return target;

  return null;
}

/**
 * Проверяет, определено ли значение (не `undefined` и не `null`).
 *
 * @param value Значение для проверки.
 * @returns `true`, если значение определено.
 */
function isDefined(value: unknown): boolean {
  return value !== undefined && value !== null;
}

/**
 * Хук `useEventListener` позволяет безопасно добавлять и удалять обработчики событий на DOM-элементах, окне или документе.
 *
 * Обновляет обработчик при изменении `listener` или `options`. Также удаляет его при размонтировании компонента.
 *
 * @param props Параметры хука.
 * @returns Кортеж из двух функций: `bind` и `unbind`, которые позволяют вручную привязать или отвязать обработчик.
 *
 * @example
 * ```tsx
 * useEventListener({
 *   target: window,
 *   type: 'resize',
 *   listener: () => console.log('resized'),
 * });
 * ```
 */
export const useEventListener = ({
  target = 'document',
  type,
  listener,
  options,
  when = true,
}: UseEventListenerProps): readonly [() => void, () => void] => {
  const listenerRef = useRef<EventListener | null>(null);
  const prevListener = usePrevious(listener);
  const prevOptions = usePrevious(options);

  const bind = useCallback(() => {
    const resolvedTarget = resolveTarget(target);
    if (!when || !resolvedTarget) return;

    unbind();

    listenerRef.current = (event: Event): void => listener(event);
    resolvedTarget.addEventListener(type, listenerRef.current, options);
  }, [target, type, listener, options, when]);

  const unbind = useCallback(() => {
    const resolvedTarget = resolveTarget(target);
    if (listenerRef.current && resolvedTarget) {
      resolvedTarget.removeEventListener(type, listenerRef.current, options);
      listenerRef.current = null;
    }
  }, [target, type, options]);

  useEffect(() => {
    bind();
    return (): void => unbind();
  }, [bind, unbind]);

  useEffect(() => {
    const listenerChanged = prevListener !== listener;
    const optionsChanged = prevOptions !== options;

    if (listenerChanged || optionsChanged) {
      unbind();
      if (when) bind();
    }
  }, [listener, options, when]);

  useUnmountEffect(unbind);

  return [bind, unbind] as const;
};
