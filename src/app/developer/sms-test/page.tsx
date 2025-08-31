'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from '@/config/api';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, SmartphoneIcon, SendIcon, CheckIcon, AlertTriangle } from 'lucide-react';

export default function SmsTestPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('This is a test message from FloodCast Alert System');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const sendTestSms = async () => {
    if (!phoneNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a phone number",
      });
      return;
    }

    try {
      setLoading(true);
      
      toast({
        title: "Sending SMS...",
        description: `Attempting to send message to ${phoneNumber}`,
      });

      const response = await fetch(API_ENDPOINTS.twilioTest, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          message: message || 'Test message from FloodCast',
        }),
      });

      const data = await response.json();
      setResult(data);

      if (response.ok && data.success) {
        toast({
          title: "SMS Sent Successfully",
          description: `Message sent to ${phoneNumber}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Failed to Send SMS",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: "Network Error",
        description: "Could not connect to the SMS service",
        variant: "destructive",
      });
      setResult({ error: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">SMS Testing Utility</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          This utility allows developers to test the SMS functionality of FloodCast.
        </p>

        <div className="grid gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SmartphoneIcon className="h-5 w-5 mr-2 text-blue-600" />
                Send Test SMS
              </CardTitle>
              <CardDescription>
                Send a test SMS message to any phone number.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (with country code)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Include the country code (e.g., +1 for US, +91 for India)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter message to send"
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between">
                  <p className="text-xs text-gray-500">
                    {message.length} characters
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setMessage('This is a test message from FloodCast Alert System')}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>

              <Button
                onClick={sendTestSms}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>Sending...</>
                ) : (
                  <>
                    <SendIcon className="h-4 w-4 mr-2" />
                    Send Test SMS
                  </>
                )}
              </Button>

              {result && (
                <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-900' : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900'}`}>
                  <div className="flex items-start">
                    {result.success ? (
                      <CheckIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium">
                        {result.success ? 'SMS Sent Successfully' : 'Failed to Send SMS'}
                      </h3>
                      <pre className="text-sm mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-4">
                <h3 className="font-medium mb-2">Developer Notes</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>This page is for development and testing purposes only</li>
                  <li>SMS are sent using the Twilio API integration</li>
                  <li>Standard SMS rates may apply based on the recipient's carrier</li>
                  <li>All SMS activities are logged for audit purposes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
