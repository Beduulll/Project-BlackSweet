import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../utils/error";

export function useFetch<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (silent: boolean) => {
      try {
        if (!silent) setLoading(true);
        setError(null);
        setData(await fetcher());
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [fetcher]
  );

  useEffect(() => {
    load(false);
  }, [load]);

  const reload = useCallback(() => load(true), [load]);

  const retry = useCallback(() => load(false), [load]);

  return { data, loading, error, reload, retry };
}
