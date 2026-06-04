import React from "react";
import { useLocalServerData } from "../hooks/useLocalServerData";

const LocalServerDashboard = () => {
  const {
    organizations,
    publicModels,
    proprietaryModels,
    comparisonResults,
    isLoading,
    error,
  } = useLocalServerData();

  if (isLoading) {
    return (
      <div className="loading-vellum">Loading Local Server Dashboard...</div>
    );
  }

  if (error) {
    return (
      <div className="error-section">
        <h2>Error:</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="vellum-dashboard local-server-dashboard">
      <h2>Local Server Data Dashboard</h2>
      <p>
        This data is coming from the Express server running on `localhost:8000`.
      </p>

      <div className="data-section">
        <h3>Organizations ({organizations.length})</h3>
        {organizations.length > 0 ? (
          <ul>
            {organizations.map((org) => (
              <li key={org.id}>{org.name}</li>
            ))}
          </ul>
        ) : (
          <p>No organizations found.</p>
        )}
      </div>

      <div className="data-section">
        <h3>Public Models ({publicModels.length})</h3>
        {publicModels.length > 0 ? (
          <ul>
            {publicModels.map((model) => (
              <li key={model.id}>{model.name}</li>
            ))}
          </ul>
        ) : (
          <p>No public models found.</p>
        )}
      </div>

      <div className="data-section">
        <h3>Proprietary Models ({proprietaryModels.length})</h3>
        {proprietaryModels.length > 0 ? (
          <ul>
            {proprietaryModels.map((model) => (
              <li key={model.id}>{model.name}</li>
            ))}
          </ul>
        ) : (
          <p>No proprietary models found.</p>
        )}
      </div>

      <div className="data-section">
        <h3>Comparison Results ({comparisonResults.length})</h3>
        {comparisonResults.length > 0 ? (
          <ul>
            {comparisonResults.map((result) => (
              <li key={result.id}>{result.test_name}</li>
            ))}
          </ul>
        ) : (
          <p>No comparison results found.</p>
        )}
      </div>
    </div>
  );
};

export default LocalServerDashboard;
