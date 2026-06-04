import { useState, useEffect } from "react";
import { useSupabaseAuth } from "./useSupabaseAuth";
import { supabase } from "../lib/supabase";

export const useVellumData = () => {
  const { supabaseUser, isAuthenticated, isLoading } = useSupabaseAuth();
  const [organizations, setOrganizations] = useState([]);
  const [publicModels, setPublicModels] = useState([]);
  const [proprietaryModels, setProprietaryModels] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && supabaseUser) {
        setIsDataLoading(true);
        setError(null);

        try {
          // Fetch organizations the user belongs to
          const { data: orgs, error: orgsError } = await supabase.from(
            "organizations"
          ).select(`
              *,
              proprietary_models(*),
              comparison_results(*)
            `);
          if (orgsError) throw orgsError;
          setOrganizations(orgs || []);

          // Fetch all public models
          const { data: publicM, error: publicMError } = await supabase
            .from("public_models")
            .select("*");
          if (publicMError) throw publicMError;
          setPublicModels(publicM || []);

          // The proprietary models and comparison results are nested in organizations
          // but we can also fetch them separately if needed
          if (orgs && orgs.length > 0) {
            const orgIds = orgs.map((o) => o.id);

            const { data: propModels, error: propError } = await supabase
              .from("proprietary_models")
              .select("*")
              .in("org_id", orgIds);
            if (propError) throw propError;
            setProprietaryModels(propModels || []);

            const { data: compResults, error: compError } = await supabase
              .from("comparison_results")
              .select("*")
              .in("org_id", orgIds);
            if (compError) throw compError;
            setComparisonResults(compResults || []);
          }
        } catch (err) {
          setError("Failed to fetch Vellum data from Supabase");
          console.error("Vellum data fetch error:", err);
        } finally {
          setIsDataLoading(false);
        }
      }
    };

    if (!isLoading) {
      fetchData();
    }
  }, [supabaseUser, isAuthenticated, isLoading]);

  return {
    organizations,
    publicModels,
    proprietaryModels,
    comparisonResults,
    isLoading: isLoading || isDataLoading,
    error,
  };
};
