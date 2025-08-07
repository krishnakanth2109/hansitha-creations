import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Checkout: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['email', 'firstName', 'lastName', 'phone'];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: 'Error',
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          variant: 'destructive',
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (cartItems.length === 0) {
      toast({ title: 'Error', description: 'Your cart is empty.', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);

    const subtotal = getTotalPrice();
    const shipping = subtotal > 50 ? 0 : 99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    try {
      const res = await fetch(`http://localhost:8080/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          cartItems,
          totalAmount: total,
        }),
      });

      if (!res.ok) throw new Error('Failed to save order');

      clearCart();
      toast({ title: 'Order Placed', description: 'Thank you for your order!' });
      navigate('/order-confirmation');
    } catch (err) {
      toast({ title: 'Error', description: 'Order could not be saved.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-pink-400 p-8">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-pink-400 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Contact Info Only */}
            <div className="space-y-6">
              <CheckoutSection
                icon={<User className="w-5 h-5" />}
                title="Contact Information"
                fields={[
                  { id: 'email', label: 'Email Address' },
                  { id: 'firstName', label: 'First Name' },
                  { id: 'lastName', label: 'Last Name' },
                  { id: 'phone', label: 'Phone Number' },
                ]}
                formData={formData}
                handleChange={handleInputChange}
              />
            </div>

            {/* Right - Summary */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <Card>
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">{item.name}</h3>
                          <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <SummaryRow label="Subtotal" value={subtotal} />
                      <SummaryRow label="Shipping" value={shipping} />
                      <SummaryRow label="Tax" value={tax} />
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900" disabled={isProcessing}>
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Place Order
                        </div>
                      )}
                    </Button>

                    <p className="text-sm text-center text-gray-600 flex items-center justify-center gap-1 mt-2">
                      <Lock className="w-3 h-3" /> Your order details are safe and secure.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

// Reusable Components
const InputGroup = ({ id, label, value, onChange, maxLength }: any) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} name={id} value={value} onChange={onChange} maxLength={maxLength} />
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span>₹{value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
  </div>
);

const CheckoutSection = ({
  icon,
  title,
  fields,
  formData,
  handleChange,
}: {
  icon: React.ReactNode;
  title: string;
  fields: any[];
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">{icon} {title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {fields.map(field => (
        <InputGroup
          key={field.id}
          id={field.id}
          label={field.label}
          value={formData[field.id]}
          onChange={handleChange}
          maxLength={field.maxLength}
        />
      ))}
    </CardContent>
  </Card>
);
