import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Check,
  CreditCard,
  Loader2,
  Lock,
  CreditCard as PayFastIcon,
} from "lucide-react";

const plans = [
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 149.99,
    description: "Full access to all content for your grade and country",
    features: [
      "Unlimited access to learning materials",
      "AI-powered learning assistant",
      "Virtual labs and experiments",
      "Study buddy and progress tracking",
      "Monthly billing",
    ],
    billingPeriod: "month",
  },
  {
    id: "annual",
    name: "Annual Plan",
    price: 1499.99,
    description: "Save 17% with our annual plan",
    features: [
      "All features in the monthly plan",
      "Save 17% compared to monthly billing",
      "Access to premium study resources",
      "Priority support",
      "Annual billing",
    ],
    billingPeriod: "year",
    popular: true,
  },
];

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState(plans[1].id);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        // Redirect to login if not logged in
        navigate("/auth");
      }
    };

    checkUser();
  }, [navigate]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // In a real app, this would create a PayFast checkout session
      // For demo purposes, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update user subscription status in the database
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_plan: selectedPlan,
            subscription_status: "active",
            subscription_start_date: new Date().toISOString(),
            payment_provider: "payfast",
            currency: "ZAR",
          })
          .eq("id", user.id);

        if (error) throw error;
      }

      toast({
        title: "Payment successful",
        description: "Thank you for subscribing to Lumerous!",
      });

      // Redirect to home page
      navigate("/home");
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description:
          error.message || "An error occurred during payment processing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlan = (id: string) =>
    plans.find((plan) => plan.id === id) || plans[0];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#0197cf] dark:text-[#01d2ff]">
        Choose Your Plan
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-md mx-auto">
        Select the plan that works best for you and start your learning journey
      </p>

      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="payment">Payment Details</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`border-2 relative ${selectedPlan === plan.id ? "border-[#0197cf]" : "border-[#e6f7fc] dark:border-gray-700"}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-[#0197cf] text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">R{plan.price}</span>
                      <span className="text-muted-foreground">
                        /{plan.billingPeriod}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-[#0197cf] mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${selectedPlan === plan.id ? "bg-[#0197cf] hover:bg-[#01729b]" : "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"}`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PayFastIcon className="mr-2 h-5 w-5" />
                  PayFast Payment
                </CardTitle>
                <CardDescription>
                  You've selected the {getPlan(selectedPlan).name} at R
                  {getPlan(selectedPlan).price}/
                  {getPlan(selectedPlan).billingPeriod}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Card Information</Label>
                  <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                    <p className="text-center text-muted-foreground">
                      PayFast payment form would be integrated here
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Billing Address</Label>
                  <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                    <p className="text-center text-muted-foreground">
                      Billing address form would be integrated here
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>R{getPlan(selectedPlan).price}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R{getPlan(selectedPlan).price}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-[#0197cf] hover:bg-[#01729b]"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay R{getPlan(selectedPlan).price}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
