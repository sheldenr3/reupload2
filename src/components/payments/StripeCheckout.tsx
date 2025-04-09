import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Lock } from "lucide-react";

interface StripeCheckoutProps {
  planId: string;
  planName: string;
  price: number;
  billingPeriod: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StripeCheckout({
  planId,
  planName,
  price,
  billingPeriod,
  onSuccess,
  onCancel,
}: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would create a Stripe checkout session
      // and redirect the user to Stripe's checkout page

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful payment
      toast({
        title: "Payment successful",
        description: `You have successfully subscribed to the ${planName} plan.`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description:
          error.message || "An error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
        <h3 className="font-medium mb-2">Order Summary</h3>
        <div className="flex justify-between mb-2">
          <span>{planName}</span>
          <span>
            ${price}/{billingPeriod}
          </span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${price}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-[#0197cf] hover:bg-[#01729b]"
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
              Pay ${price}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
