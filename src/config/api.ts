// src/config/api.ts
/**
 * API configuration for the FloodCast frontend
 */

// Ensure the correct host is used even if development port changes
const getBaseUrl = () => {
  // Use environment variable if set, otherwise fallback to local development
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
  return `${apiUrl}/api`;
};

export const API_BASE_URL = getBaseUrl();

export const API_ENDPOINTS = {
  forecast: `${API_BASE_URL}/predict`,
  currentConditions: `${API_BASE_URL}/current-conditions`,
  wards: `${API_BASE_URL}/wards`,
  alerts: `${API_BASE_URL}/alerts`,
  alertsWithSms: `${API_BASE_URL}/alerts/register-with-sms`,
  smsInfo: `${API_BASE_URL}/alerts/sms/info`,
  smsSimulator: `${API_BASE_URL}/alerts/sms/simulator`,
  twilioTest: `${API_BASE_URL}/alerts/twilio/test`,
  metrics: `${API_BASE_URL}/metrics`,
  modelVerification: `${API_BASE_URL}/model-verification`,
};
