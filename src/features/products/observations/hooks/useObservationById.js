import { useEffect, useState } from "react";
import { getObservationById } from "../services/getObservationById";

export const useObservationById = (
  productCode,
  id,
  { enabled = true } = {}
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(
    Boolean(enabled && productCode && id != null)
  );
  const [error, setError] = useState(null);

  const fetchData = async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await getObservationById(productCode, id, { signal });
      setData(resp);
    } catch (e) {
      if (signal?.aborted) return;
      setError(e);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled || !productCode || id == null) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, productCode, id]);

  const refresh = () => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  };

  return { observation: data, loading, error, refresh };
};
