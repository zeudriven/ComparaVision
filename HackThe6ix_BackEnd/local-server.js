const express = require("express");
const cors = require("cors");

const app = express();
const port = 8000;

// Use CORS to allow requests from your React app's origin (e.g., http://localhost:3000)
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// --- MOCK DATA (simulating a database) ---
const organizations = [
  { id: "org_1", name: "Local Server Org 1" },
  { id: "org_2", name: "Local Server Org 2" },
];

const publicModels = [
  { id: "model_1", name: "Local Llama-2-7b", size_mb: 14000 },
  { id: "model_2", name: "Local Mistral-7B", size_mb: 14000 },
];

const proprietaryModels = [
  { id: "prop_1", org_id: "org_1", name: "Org 1 Custom Model", version: "1.5" },
  { id: "prop_2", org_id: "org_2", name: "Org 2 Super Model", version: "2.1" },
];

const comparisonResults = [
  {
    id: "comp_1",
    org_id: "org_1",
    test_name: "Local Test A vs B",
    winner: "Model A",
  },
];

// --- API ENDPOINTS ---

// Simple health check
app.get("/api", (req, res) => {
  res.json({ message: "Hello from your local server!" });
});

// Endpoint to get organizations
app.get("/api/organizations", (req, res) => {
  console.log("GET /api/organizations - Fetching organizations");
  res.json(organizations);
});

// Endpoint to get public models
app.get("/api/public_models", (req, res) => {
  console.log("GET /api/public_models - Fetching public models");
  res.json(publicModels);
});

// Endpoint to get proprietary models for a specific organization
app.get("/api/proprietary_models", (req, res) => {
  console.log("GET /api/proprietary_models - Fetching all proprietary models");
  res.json(proprietaryModels);
});

// Endpoint to get comparison results for a specific organization
app.get("/api/comparison_results", (req, res) => {
  console.log("GET /api/comparison_results - Fetching all comparison results");
  res.json(comparisonResults);
});

// --- START THE SERVER ---
app.listen(port, () => {
  console.log(`
================================================
  🚀 Local Express server is running on http://localhost:${port}
================================================
  `);
  console.log("Available endpoints:");
  console.log("  GET /api");
  console.log("  GET /api/organizations");
  console.log("  GET /api/public_models");
  console.log("  GET /api/proprietary_models");
  console.log("  GET /api/comparison_results");
});
