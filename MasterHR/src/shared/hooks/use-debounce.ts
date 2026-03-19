import { useCallback, useRef } from 'react';

export const useDebounce = (delay = 300) => {
  const timerRef = useRef<Undefinable<number>>(undefined);

  return useCallback(
    (cb: () => void) => {
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(cb, delay);
    },
    [delay]
  );
};
