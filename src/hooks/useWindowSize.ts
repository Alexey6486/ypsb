import { useState } from 'react';

import { useEventListener } from './useEventListener';

/**
 * Хук для отслеживания размеров окна браузера (width и height).
 *
 * Использует useEventListener для подписки на событие resize.
 */
export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Обработчик resize, обновляет состояние
  const handleResize = (): void => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Подписываемся на resize окна с помощью useEventListener
  useEventListener({
    target: 'window',
    type: 'resize',
    listener: handleResize,
  });

  // Обновим размеры сразу при монтировании
  if (
    windowSize.width === 0 &&
    windowSize.height === 0 &&
    typeof window !== 'undefined'
  ) {
    handleResize();
  }

  return windowSize;
}
