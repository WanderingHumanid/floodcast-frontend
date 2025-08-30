'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  Waves, 
  MapPin, 
  AlertTriangle, 
  Info,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Emergency contacts data for Kochi, Kerala, India
const EMERGENCY_CONTACTS = [
  {
    id: 1,
    name: 'Kerala State Disaster Management Authority (KSDMA)',
    phone: '1077',
    description: 'State emergency hotline for disaster response',
    category: 'emergency',
  },
  {
    id: 2,
    name: 'Kochi City Control Room',
    phone: '0484-2351554',
    description: 'For reporting flooding or requesting immediate assistance in Kochi',
    category: 'flood',
  },
  {
    id: 3,
    name: 'Kerala Fire & Rescue Services (Kochi)',
    phone: '101',
    description: 'Fire and rescue services for flood emergencies',
    category: 'emergency',
  },
  {
    id: 4,
    name: 'Ernakulam District Emergency Operations Center',
    phone: '0484-2423513',
    description: 'District-level coordination for flood response',
    category: 'flood',
  },
  {
    id: 5,
    name: 'Kochi Police Control Room',
    phone: '0484-2366100',
    description: 'Police emergency services during floods',
    category: 'emergency',
  },
  {
    id: 6,
    name: 'KSEB (Kerala State Electricity Board)',
    phone: '1912',
    description: 'For power outages during floods',
    category: 'utilities',
  },
  {
    id: 7,
    name: 'Kerala Water Authority (KWA)',
    phone: '0484-2360800',
    description: 'Water supply issues during floods',
    category: 'utilities',
  },
  {
    id: 8,
    name: 'Ambulance Services',
    phone: '108',
    description: 'Medical emergencies during floods',
    category: 'medical',
  },
];

// SOS Position type
interface Position {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
}

export default function EmergencyPage() {
  const { toast } = useToast();
  const [sosActive, setSosActive] = useState(false);
  const [position, setPosition] = useState<Position>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
  });
  const [isSending, setIsSending] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('I need assistance due to flooding at my location.');
  
  // Function to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to determine your location. Please enable location services.',
            variant: 'destructive',
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast({
        title: 'Location Not Supported',
        description: 'Your browser does not support location services.',
        variant: 'destructive',
      });
    }
  };

  // Activate SOS
  const activateSOS = () => {
    setIsSending(true);
    getCurrentLocation();
    
    // Simulate sending SOS (in a real app, this would connect to an API)
    setTimeout(() => {
      setSosActive(true);
      setIsSending(false);
      toast({
        title: 'SOS Signal Activated',
        description: 'Emergency services have been notified of your location.',
        variant: 'default',
      });
    }, 2000);
  };

  // Deactivate SOS
  const deactivateSOS = () => {
    setSosActive(false);
    toast({
      title: 'SOS Deactivated',
      description: 'Your SOS signal has been turned off.',
      variant: 'default',
    });
  };

  // Send custom message
  const sendCustomMessage = () => {
    if (!contactName || !contactPhone || !contactMessage) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields before sending.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    getCurrentLocation();
    
    // Simulate sending message (in a real app, this would connect to an API)
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: 'Message Sent',
        description: `Your message has been sent to ${contactName}.`,
        variant: 'default',
      });
      
      // Reset form
      setContactName('');
      setContactPhone('');
      setContactMessage('I need assistance due to flooding at my location.');
    }, 1500);
  };

  // Filter contacts by category
  const getContactsByCategory = (category: string) => {
    return EMERGENCY_CONTACTS.filter(contact => contact.category === category);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Emergency Response</h1>
      <p className="text-gray-500 mb-8">Get help during flood emergencies and contact support services</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SOS Card */}
        <Card className={sosActive ? "border-red-500 shadow-red-100" : ""}>
          <CardHeader className={sosActive ? "bg-red-50" : ""}>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Emergency SOS Signal
            </CardTitle>
            <CardDescription>
              Activate this in case of immediate danger
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {sosActive ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-red-500 animate-ping opacity-75"></div>
                  <div className="relative rounded-full bg-red-600 p-4">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <p className="mt-4 font-semibold text-red-600 text-center">SOS ACTIVE</p>
                {position.latitude && position.longitude && (
                  <div className="mt-4 w-full">
                    <p className="text-sm text-gray-600">Your current location:</p>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md mt-1">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">
                          {position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        ±{position.accuracy ? Math.round(position.accuracy) : '?'}m
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="mb-4 text-sm text-gray-600">
                  Activating SOS will send your current location to emergency services and mark your position on the emergency response map.
                </p>
                <div className="inline-block p-4 rounded-full bg-gray-100">
                  <AlertTriangle className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {sosActive ? (
              <Button variant="outline" onClick={deactivateSOS} className="w-full">
                Deactivate SOS
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={activateSOS} 
                className="w-full"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  'Activate SOS'
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Emergency Contacts Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>
              Important phone numbers for flood emergencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="emergency">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
                <TabsTrigger value="flood">Flood Services</TabsTrigger>
                <TabsTrigger value="utilities">Utilities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="emergency" className="space-y-4">
                {getContactsByCategory('emergency').map(contact => (
                  <div key={contact.id} className="flex justify-between items-center p-3 bg-red-50 rounded-md border border-red-100">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.description}</p>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`} 
                      className="flex items-center bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </a>
                  </div>
                ))}
                {getContactsByCategory('evacuation').map(contact => (
                  <div key={contact.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-md border border-amber-100">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.description}</p>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`} 
                      className="flex items-center bg-amber-600 text-white px-3 py-2 rounded-md hover:bg-amber-700 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="flood" className="space-y-4">
                {getContactsByCategory('flood').map(contact => (
                  <div key={contact.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.description}</p>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`} 
                      className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </a>
                  </div>
                ))}
                {getContactsByCategory('weather').map(contact => (
                  <div key={contact.id} className="flex justify-between items-center p-3 bg-indigo-50 rounded-md border border-indigo-100">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.description}</p>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`} 
                      className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="utilities" className="space-y-4">
                {getContactsByCategory('utilities').map(contact => (
                  <div key={contact.id} className="flex justify-between items-center p-3 bg-purple-50 rounded-md border border-purple-100">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.description}</p>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`} 
                      className="flex items-center bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </a>
                  </div>
                ))}
                {getContactsByCategory('infrastructure').map(contact => (
                  <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.description}</p>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`} 
                      className="flex items-center bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Custom Alert Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Send Custom Alert
            </CardTitle>
            <CardDescription>
              Request help from a specific contact with your current location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name</Label>
                  <Input 
                    id="contact-name" 
                    placeholder="Enter name" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input 
                    id="contact-phone" 
                    placeholder="Enter phone number" 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <textarea 
                    id="contact-message"
                    className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your situation and needs"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={sendCustomMessage}
                  disabled={isSending || !contactName || !contactPhone}
                  className="w-full"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Alert Message'
                  )}
                </Button>
              </div>
              
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>How this works</AlertTitle>
                  <AlertDescription>
                    This will send your current location along with your message to the specified contact. Make sure the person you're contacting is available to help.
                  </AlertDescription>
                </Alert>
                
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Your current location will be shared as:</h3>
                  {position.latitude && position.longitude ? (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Latitude: <span className="font-mono">{position.latitude.toFixed(6)}</span></span>
                      </div>
                      <div className="flex items-center text-sm mt-1">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Longitude: <span className="font-mono">{position.longitude.toFixed(6)}</span></span>
                      </div>
                      <div className="flex items-center text-sm mt-1">
                        <Info className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Accuracy: <span className="font-mono">±{position.accuracy ? Math.round(position.accuracy) : '?'} meters</span></span>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={getCurrentLocation} size="sm">
                      Get My Location
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Waves className="mr-2 h-5 w-5" />
              Flood Emergency FAQ
            </CardTitle>
            <CardDescription>
              Frequently asked questions about handling flood emergencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What should I do if my home starts to flood?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">If your home is flooding:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Move to higher ground or the highest level of your home</li>
                    <li>Turn off electricity at the main breaker if safe to do so</li>
                    <li>Avoid walking through moving water - 6 inches can knock you down</li>
                    <li>Use the SOS feature on this page to alert emergency services</li>
                    <li>If instructed to evacuate, do so immediately</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I prepare my home for possible flooding?</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Move valuable items to higher floors</li>
                    <li>Prepare an emergency kit with essentials</li>
                    <li>Clear gutters and drains</li>
                    <li>Consider using sandbags for doorways and low points</li>
                    <li>Know your evacuation route in advance</li>
                    <li>Keep important documents in waterproof containers</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it safe to drive during a flood?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2"><strong>No, it is rarely safe to drive during a flood.</strong></p>
                  <p className="mb-2">Remember the safety rule: "Turn Around, Don't Drown"</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Just 12 inches of water can float most vehicles</li>
                    <li>Two feet of rushing water can carry away most vehicles including SUVs</li>
                    <li>You cannot tell the depth of water or road conditions beneath the water</li>
                    <li>Floodwaters may hide dangerous debris or washed-out roadways</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>What should be in my flood emergency kit?</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium mb-2">Basic Supplies:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Water (1 gallon per person per day for 3+ days)</li>
                        <li>Non-perishable food (3+ day supply)</li>
                        <li>Battery-powered or hand-crank radio</li>
                        <li>Flashlight and extra batteries</li>
                        <li>First aid kit</li>
                        <li>Whistle to signal for help</li>
                        <li>Dust mask, plastic sheeting, and duct tape</li>
                        <li>Moist towelettes, garbage bags, and plastic ties</li>
                        <li>Wrench or pliers to turn off utilities</li>
                        <li>Manual can opener</li>
                        <li>Local maps</li>
                        <li>Cell phone with chargers and backup battery</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Additional Items:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Prescription medications</li>
                        <li>Glasses and contact lens solution</li>
                        <li>Infant formula, diapers, wipes</li>
                        <li>Pet food and extra water for your pet</li>
                        <li>Important family documents in waterproof container</li>
                        <li>Cash or traveler's checks</li>
                        <li>Sleeping bag or warm blanket for each person</li>
                        <li>Complete change of clothing</li>
                        <li>Household chlorine bleach and medicine dropper</li>
                        <li>Fire extinguisher</li>
                        <li>Matches in a waterproof container</li>
                        <li>Feminine supplies and personal hygiene items</li>
                        <li>Mess kits, paper cups, plates, towels, plastic utensils</li>
                        <li>Paper and pencil</li>
                        <li>Books, games, puzzles for children</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>What should I do after a flood?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">After a flood, take these safety precautions:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Listen to authorities for information and instructions</li>
                    <li>Avoid floodwaters; water may be contaminated or electrically charged</li>
                    <li>Don't use any appliances or electronics until they've been checked for safety</li>
                    <li>Use caution when entering buildings; there may be hidden damage</li>
                    <li>Clean and disinfect everything that got wet</li>
                    <li>Document damage for insurance claims (photos and videos)</li>
                    <li>Be aware of areas where floodwaters have receded; roads may have weakened</li>
                    <li>Stay clear of downed power lines and report them to the power company</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
