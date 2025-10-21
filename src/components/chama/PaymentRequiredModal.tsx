import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePaidChamaJoin } from '@/hooks/usePaidChamaJoin';
import { CreditCard, Smartphone, Loader2 } from 'lucide-react';

interface PaymentRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  chamaId: string;
  chamaName: string;
  joiningFee: number;
}

export const PaymentRequiredModal = ({
  isOpen,
  onClose,
  chamaId,
  chamaName,
  joiningFee
}: PaymentRequiredModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'paystack'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  
  const { initiatePayment, isInitiatingPayment } = usePaidChamaJoin();

  const handlePayment = async () => {
    try {
      await initiatePayment.mutateAsync({
        chamaId,
        amount: joiningFee,
        paymentMethod,
        phoneNumber: paymentMethod === 'mpesa' ? phoneNumber : undefined,
        email: paymentMethod === 'paystack' ? email : undefined
      });
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Payment to Join</DialogTitle>
          <DialogDescription>
            Pay KES {joiningFee.toFixed(2)} to join {chamaName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="mpesa" id="mpesa" />
                <Label htmlFor="mpesa" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="h-5 w-5" />
                  <div>
                    <div className="font-medium">M-Pesa</div>
                    <div className="text-sm text-muted-foreground">Pay via M-Pesa STK Push</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="paystack" id="paystack" />
                <Label htmlFor="paystack" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Card / Bank / Other</div>
                    <div className="text-sm text-muted-foreground">Pay via Paystack (Card, Bank Transfer, USSD, Mobile Money)</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* M-Pesa Phone Number */}
          {paymentMethod === 'mpesa' && (
            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={12}
              />
              <p className="text-sm text-muted-foreground">
                Enter your M-Pesa registered phone number
              </p>
            </div>
          )}

          {/* Paystack Email */}
          {paymentMethod === 'paystack' && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                You'll receive payment confirmation via email
              </p>
            </div>
          )}

          {/* Amount Summary */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Joining Fee</span>
              <span>KES {joiningFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total Amount</span>
              <span>KES {joiningFee.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Your membership will be activated automatically after payment verification
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isInitiatingPayment}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1"
              disabled={
                isInitiatingPayment ||
                (paymentMethod === 'mpesa' && !phoneNumber) ||
                (paymentMethod === 'paystack' && !email)
              }
            >
              {isInitiatingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay KES {joiningFee.toFixed(2)}</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
