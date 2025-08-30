import { API_ENDPOINTS } from '@/config/api';

export interface MetricsResponse {
  enhanced_model: {
    rmse: number;
    mae: number;
    r2: number;
    mape: number;
    lead_time_hours: number;
  };
  forecast_horizons: {
    [key: string]: {
      rmse: number;
      r2: number;
      mape: number;
    };
  };
  high_water_levels: {
    samples: number;
    rmse: number;
    r2: number;
    mape: number;
  };
  extreme_events: {
    correct_predictions: number;
    false_alarms: number;
    lead_time_accuracy: number;
  };
  feature_importance: Array<{
    feature: string;
    importance: number;
  }>;
}

export interface MetricExplanation {
  [key: string]: {
    name: string;
    description: string;
    formula: string;
    interpretation: string;
  };
}

export const MetricDetails: MetricExplanation = {
  rmse: {
    name: 'Root Mean Square Error (RMSE)',
    description: 'A measure of the average magnitude of errors between predicted and actual values.',
    formula: 'RMSE = sqrt(1/n * sum((y_pred - y_actual)²))',
    interpretation: 'Lower values indicate better model performance. This metric gives higher weight to larger errors.'
  },
  mae: {
    name: 'Mean Absolute Error (MAE)',
    description: 'Average of absolute differences between predicted and actual values.',
    formula: 'MAE = 1/n * sum(|y_pred - y_actual|)',
    interpretation: 'Lower values indicate better model performance. This metric treats all errors equally.'
  },
  r2: {
    name: 'R-squared (R²)',
    description: 'Proportion of variance in the dependent variable that is predictable from the independent variables.',
    formula: 'R² = 1 - (sum((y_actual - y_pred)²) / sum((y_actual - y_mean)²))',
    interpretation: 'Ranges from 0 to 1, with 1 indicating perfect prediction. Values closer to 1 indicate better model fit.'
  },
  mape: {
    name: 'Mean Absolute Percentage Error (MAPE)',
    description: 'Average of percentage errors between predicted and actual values.',
    formula: 'MAPE = 100% * 1/n * sum(|y_actual - y_pred| / |y_actual|)',
    interpretation: 'Expressed as a percentage. Lower values indicate better model performance.'
  },
  lead_time_hours: {
    name: 'Lead Time (Hours)',
    description: 'The time in advance that the model can make accurate predictions.',
    formula: 'N/A',
    interpretation: 'Longer lead times indicate a more useful forecasting model for early warning systems.'
  },
  correct_predictions: {
    name: 'Correct Predictions',
    description: 'Percentage of extreme events that were correctly predicted by the model.',
    formula: 'Correct Predictions = (True Positives / (True Positives + False Negatives)) * 100',
    interpretation: 'Higher percentages indicate better ability to detect extreme events.'
  },
  false_alarms: {
    name: 'False Alarms',
    description: 'Percentage of predictions that incorrectly indicated an extreme event would occur.',
    formula: 'False Alarms = (False Positives / (False Positives + True Positives)) * 100',
    interpretation: 'Lower percentages indicate fewer false warnings.'
  },
  lead_time_accuracy: {
    name: 'Lead Time Accuracy',
    description: 'Percentage of extreme events that were predicted with sufficient lead time.',
    formula: 'Lead Time Accuracy = (Events Predicted with Sufficient Lead Time / Total Events) * 100',
    interpretation: 'Higher percentages indicate better early warning capabilities.'
  }
};

export async function getModelMetrics(): Promise<MetricsResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.modelVerification);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metrics: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching model metrics:', error);
    throw error;
  }
}
