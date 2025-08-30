'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropletIcon, BellRing, Check } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';

// Types for our form
interface AlertFormData {
  name: string;
  ward: string;
  email: string;
  phone: string;
  threshold: number;
}

// Available wards
const WARDS = [
  "Kadavanthra", "Elamkulam", "Vennala", "Palarivattom", "Kaloor", 
  "Panampilly Nagar", "Kochi Central", "Fort Kochi", "Mattancherry", 
  "Edappally", "Thrikkakara", "Kalamassery", "Maradu", "Thripunithura",
  "Ernakulam North", "Ernakulam South", "Pachalam", "Palluruthy", 
  "Vaduthala", "Vyttila", "Cheranalloor", "Vypeen"
];

export default function AlertsPage() {
  // Alert confirmation state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<AlertFormData>({
    name: '',
    ward: '',
    email: '',
    phone: '',
    threshold: 75
  });

  // Thresholds for alert levels
  const thresholdOptions = [75, 80, 85, 90, 95];
  
  // API status state
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [apiMessage, setApiMessage] = useState('');

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'threshold' ? parseInt(value) : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Set loading state
      setApiStatus('loading');
      
      // Send data to backend API
      const response = await fetch(API_ENDPOINTS.alerts, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success
        setApiStatus('success');
        setApiMessage(data.message || 'Alert set up successfully!');
        setShowConfirmation(true);
      } else {
        // API error
        setApiStatus('error');
        setApiMessage(data.error || 'Failed to set up alert. Please try again.');
        setShowConfirmation(true);
      }
    } catch (error) {
      // Network or other error
      console.error('Error setting up alert:', error);
      setApiStatus('error');
      setApiMessage('Network error. Please check your connection and try again.');
      setShowConfirmation(true);
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      // Reset status after hiding
      if (apiStatus === 'success') {
        setApiStatus('idle');
      }
    }, 5000);
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-4">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Set Up Flood Alerts
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main form card */}
          <div className="md:col-span-2">
            <Card className="shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
              <CardHeader>
                <CardTitle>Alert Me!</CardTitle>
                <CardDescription>
                  Register to receive alerts when your area is at risk of flooding.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showConfirmation ? (
                  apiStatus === 'loading' ? (
                    <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900">
                      <div className="animate-spin mr-2">
                        <DropletIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <AlertTitle className="text-blue-600 dark:text-blue-400">Setting Up Your Alert...</AlertTitle>
                      <AlertDescription className="text-blue-600/90 dark:text-blue-400/90">
                        Please wait while we register your alert preferences.
                      </AlertDescription>
                    </Alert>
                  ) : apiStatus === 'error' ? (
                    <Alert className="mb-6 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900">
                      <AlertTitle className="text-red-600 dark:text-red-400">Error</AlertTitle>
                      <AlertDescription className="text-red-600/90 dark:text-red-400/90">
                        {apiMessage}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <AlertTitle className="text-green-600 dark:text-green-400">Alert Set Up Successfully</AlertTitle>
                      <AlertDescription className="text-green-600/90 dark:text-green-400/90">
                        You will receive alerts when {formData.ward} ward's flood risk exceeds {formData.threshold}%.
                      </AlertDescription>
                    </Alert>
                  )
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ward">Select Your Ward</Label>
                    <Select 
                      name="ward" 
                      value={formData.ward} 
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          ward: value
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a ward" />
                      </SelectTrigger>
                      <SelectContent>
                        {WARDS.sort().map((ward) => (
                          <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="threshold">Alert Threshold (Flood Risk %)</Label>
                    <Select 
                      name="threshold" 
                      value={formData.threshold.toString()} 
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          threshold: parseInt(value)
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select threshold" />
                      </SelectTrigger>
                      <SelectContent>
                        {thresholdOptions.map((value) => (
                          <SelectItem key={value} value={value.toString()}>{value}%</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      You will be alerted when the flood risk in your area exceeds this percentage.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit"
                      disabled={apiStatus === 'loading'}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {apiStatus === 'loading' ? (
                        <>
                          <span className="animate-spin mr-2">
                            <DropletIcon className="h-5 w-5" />
                          </span>
                          Setting Up...
                        </>
                      ) : (
                        'Set Up Alerts'
                      )}
                    </Button>
                  </div>
                  
                  {apiStatus === 'success' && (
                    <div className="pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          // Reset form
                          setFormData({
                            name: '',
                            ward: '',
                            email: '',
                            phone: '',
                            threshold: 75
                          });
                          setApiStatus('idle');
                          setShowConfirmation(false);
                        }}
                        className="w-full"
                      >
                        Set Up Another Alert
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info card */}
          <div>
            <Card className="shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellRing className="h-5 w-5 mr-2 text-blue-600" />
                  <span>How Alerts Work</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  FloodCast's alert system continuously monitors flood risk levels across all wards in Kochi.
                </p>
                
                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Real-time Monitoring</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our system analyzes data from multiple sources including rainfall, tidal patterns, and terrain conditions.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Personalized Thresholds</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You decide at what risk level you want to be notified, starting from 75% flood probability.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Multi-channel Alerts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive notifications via email and SMS to ensure you never miss critical warnings.
                  </p>
                </div>
                
                <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4 mt-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <DropletIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Important</h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                        <p>
                          While our alerts are highly accurate, always follow official evacuation orders and government advisories during extreme weather events.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
