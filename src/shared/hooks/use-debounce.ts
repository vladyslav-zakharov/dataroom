'use client';

import { useEffect, useState } from 'react';

const DEFAULT_DELAY = 300;

export const useDebounce = <T>(value: T, delay = DEFAULT_DELAY) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
