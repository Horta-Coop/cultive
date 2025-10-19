import { useState, useCallback } from "react";
import axios from "../lib/axios";

export function usePlantioStore() {
  const [plantings, setPlantings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlantings = useCallback(async (opts = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (opts.hortaId) params.hortaId = opts.hortaId;
      const res = await axios.get("/api/plantio", { params });
      setPlantings(res.data?.plantios ?? []);
      setLoading(false);
      return res.data?.plantios ?? [];
    } catch (err) {
      setError(err);
      setLoading(false);
      return [];
    }
  }, []);

  return {
    plantings,
    loading,
    error,
    fetchPlantings,
    setPlantings,
  };
}

export default usePlantioStore;