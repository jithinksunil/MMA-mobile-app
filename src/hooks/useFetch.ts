import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * A generic data-fetching hook with loading and error states.
 *
 * @example
 * const { data, loading, error, refetch } = useFetch<User[]>(() =>
 *   fetch('https://api.example.com/users').then(r => r.json())
 * );
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  _deps: React.DependencyList = [],
): UseFetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFnRef = useRef(fetchFn);
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFnRef.current();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      void execute();
    },
  };
}
