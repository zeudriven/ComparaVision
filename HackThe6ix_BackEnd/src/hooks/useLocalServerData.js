import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const API_BASE_URL = "http://localhost:8000/api";

export const useLocalServerData = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth0();
  const [data, setData] = useState({
    organizations: [],
    publicModels: [],
    proprietaryModels: [],
    comparisonResults: [],
  });
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        setIsDataLoading(true);
        setError(null);

        try {
          // Fetch all data points in parallel
          const [orgsRes, publicModelsRes, propModelsRes, compResultsRes] =
            await Promise.all([
              fetch(`${API_BASE_URL}/organizations`),
              fetch(`${API_BASE_URL}/public_models`),
              fetch(`${API_BASE_URL}/proprietary_models`),
              fetch(`${API_BASE_URL}/comparison_results`),
            ]);

          // Check for errors in responses
          if (!orgsRes.ok)
            throw new Error(
              `Failed to fetch organizations: ${orgsRes.statusText}`
            );
          if (!publicModelsRes.ok)
            throw new Error(
              `Failed to fetch public models: ${publicModelsRes.statusText}`
            );
          if (!propModelsRes.ok)
            throw new Error(
              `Failed to fetch proprietary models: ${propModelsRes.statusText}`
            );
          if (!compResultsRes.ok)
            throw new Error(
              `Failed to fetch comparison results: ${compResultsRes.statusText}`
            );

          // Parse JSON data
          const orgs = await orgsRes.json();
          const publicModels = await publicModelsRes.json();
          const proprietaryModels = await propModelsRes.json();
          const comparisonResults = await compResultsRes.json();

          setData({
            organizations: orgs || [],
            publicModels: publicModels || [],
            proprietaryModels: proprietaryModels || [],
            comparisonResults: comparisonResults || [],
          });
        } catch (err) {
          setError(
            `Failed to fetch data from local server. Is it running? Error: ${err.message}`
          );
          console.error("Local server fetch error:", err);
        } finally {
          setIsDataLoading(false);
        }
      }
    };

    if (!isAuthLoading) {
      fetchData();
    }
  }, [isAuthenticated, isAuthLoading]);

  return {
    ...data,
    isLoading: isAuthLoading || isDataLoading,
    error,
  };
};
