// src/config/api.ts
/**
 * API configuration for the FloodCast frontend
 */

// Ensure the correct host is used even if development port changes
const getBaseUrl = () => {
  // In development, always use http://127.0.0.1:5000
  // This avoids any issues with localhost vs 127.0.0.1 and ensures CORS works correctly
  return `http://127.0.0.1:5000/api`;
};

export const API_BASE_URL = getBaseUrl();

export const API_ENDPOINTS = {
  forecast: `${API_BASE_URL}/predict`,
  currentConditions: `${API_BASE_URL}/current-conditions`,
  wards: `${API_BASE_URL}/wards`,
  alerts: `${API_BASE_URL}/alerts`,
  metrics: `${API_BASE_URL}/metrics`,
  modelVerification: `${API_BASE_URL}/model-verification`,
};
