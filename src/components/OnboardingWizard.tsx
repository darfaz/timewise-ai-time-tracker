import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useConfig } from "@/contexts/ConfigContext";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Clock, Briefcase, CheckCircle, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [step, setStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState<"general" | "legal" | null>(null);
  const [apiUrl, setApiUrl] = useState("http://localhost:3000/api");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const { setLegalMode, setApiBaseUrl } = useConfig();
  const { toast } = useToast();

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleModeSelect = (mode: "general" | "legal") => {
    setSelectedMode(mode);
    setLegalMode(mode === "legal");
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("idle");
    
    try {
      await apiClient.checkHealth();
      setConnectionStatus("success");
      toast({
        title: "Connection successful!",
        description: "Successfully connected to the backend.",
      });
    } catch (error) {
      setConnectionStatus("error");
      toast({
        title: "Connection failed",
        description: "Could not connect to the backend. You can skip and use mock data.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSkipConnection = () => {
    setApiBaseUrl("");
    handleNext();
  };

  const handleComplete = () => {
    if (apiUrl && connectionStatus === "success") {
      setApiBaseUrl(apiUrl);
    }
    
    localStorage.setItem("onboarding_completed", "true");
    toast({
      title: "Welcome aboard! 🎉",
      description: selectedMode === "legal" 
        ? "BillExact is ready to track your billable hours." 
        : "TimeWise is ready to boost your productivity.",
    });
    onComplete();
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Welcome */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-gradient-primary p-6">
                      <Sparkles className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-foreground">Welcome!</h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Let's get you set up with the perfect time tracking solution. 
                    Our intelligent system can help you capture 30+ minutes per day 
                    that would otherwise go unbilled or untracked.
                  </p>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Automatic Activity Tracking</p>
                        <p className="text-sm text-muted-foreground">Capture every billable moment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Smart Categorization</p>
                        <p className="text-sm text-muted-foreground">AI-powered project assignment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Compliance Ready</p>
                        <p className="text-sm text-muted-foreground">LEDES export for legal billing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleNext} size="lg">
                    Get Started
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Choose Mode */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-foreground">Choose Your Mode</h2>
                  <p className="text-muted-foreground">Select the mode that best fits your needs</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-hover ${
                      selectedMode === "general" ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleModeSelect("general")}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-500 p-3">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>TimeWise</CardTitle>
                          <CardDescription>General Mode</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">Perfect for:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Freelancers & consultants</li>
                        <li>• Personal productivity tracking</li>
                        <li>• Project-based work</li>
                        <li>• Team time management</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-hover ${
                      selectedMode === "legal" ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleModeSelect("legal")}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-500 p-3">
                          <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>BillExact</CardTitle>
                          <CardDescription>Legal Mode</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">Perfect for:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Attorneys & legal professionals</li>
                        <li>• Client matter tracking</li>
                        <li>• LEDES billing compliance</li>
                        <li>• UTBMS code management</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between">
                  <Button onClick={handleBack} variant="outline">
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!selectedMode}>
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Connect Backend */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-foreground">Connect Your Backend</h2>
                  <p className="text-muted-foreground">Connect to ActivityWatch or skip to use demo data</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Backend API Configuration</CardTitle>
                    <CardDescription>
                      Enter your backend API URL or use the default for local development
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-url">API URL</Label>
                      <Input
                        id="api-url"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="http://localhost:3000/api"
                      />
                    </div>

                    <Button 
                      onClick={handleTestConnection} 
                      disabled={isTestingConnection}
                      className="w-full"
                    >
                      {isTestingConnection ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing Connection...
                        </>
                      ) : (
                        "Test Connection"
                      )}
                    </Button>

                    {connectionStatus === "success" && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Connection successful!</span>
                      </div>
                    )}

                    {connectionStatus === "error" && (
                      <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Connection failed. Check your backend is running.</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button onClick={handleBack} variant="outline">
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button onClick={handleSkipConnection} variant="outline">
                      Skip (Use Demo Data)
                    </Button>
                    <Button onClick={handleNext} disabled={connectionStatus !== "success"}>
                      Continue
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Categories/Matters */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-foreground">
                    {selectedMode === "legal" ? "Set Up Matters" : "Choose Categories"}
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedMode === "legal" 
                      ? "You can add matters later from the Matters page" 
                      : "Default categories are pre-configured and ready to use"}
                  </p>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      {selectedMode === "legal" 
                        ? "You'll be able to add clients and matters from the dashboard after setup." 
                        : "Categories like Development, Meetings, and Research are ready to use."}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button onClick={handleBack} variant="outline">
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Preferences */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-foreground">Set Your Preferences</h2>
                  <p className="text-muted-foreground">You can change these anytime in Settings</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Working Hours</CardTitle>
                    <CardDescription>Set your typical working hours</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input type="time" defaultValue="09:00" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input type="time" defaultValue="17:00" />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button onClick={handleBack} variant="outline">
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Complete */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-green-500 p-6">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-foreground">You're All Set!</h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {selectedMode === "legal" 
                      ? "BillExact is configured and ready to track your billable hours with legal billing compliance." 
                      : "TimeWise is configured and ready to help you boost productivity and track your time."}
                  </p>
                </div>

                <Card className="bg-gradient-primary text-white">
                  <CardContent className="pt-6 space-y-3">
                    <h3 className="text-xl font-semibold">Next Steps:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>Check out your dashboard to see your activity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>
                          {selectedMode === "legal" 
                            ? "Add your first client and matter" 
                            : "Start tracking time on your projects"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>Explore the timeline to see automatic tracking</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button onClick={handleBack} variant="outline">
                    Back
                  </Button>
                  <Button onClick={handleComplete} size="lg">
                    Go to Dashboard
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
