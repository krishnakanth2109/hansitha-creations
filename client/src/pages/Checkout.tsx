import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock, MapPin, User } from 'lucide-react';
import axios from 'axios';

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  sameAsShipping: boolean;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
}

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    sameAsShipping: true,
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches?.[0] || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    return v.length >= 2 ? v.substring(0, 2) + '/' + v.substring(2, 4) : v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData(prev => ({ ...prev, expiryDate: formatted }));
  };

  const validateForm = () => {
    const requiredFields = [
      'email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode',
      'phone', 'cardNumber', 'expiryDate', 'cvv', 'nameOnCard'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof CheckoutFormData]) {
        toast({
          title: 'Error',
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          variant: 'destructive',
        });
        return false;
      }
    }

    if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      toast({ title: 'Error', description: 'Invalid card number.', variant: 'destructive' });
      return false;
    }

    if (formData.cvv.length < 3) {
      toast({ title: 'Error', description: 'Invalid CVV.', variant: 'destructive' });
      return false;
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

    try {
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

      await axios.post('/api/orders/place-order', {
        products: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      localStorage.setItem('lastOrderNumber', orderNumber);
      clearCart();
      toast({ title: 'Order Placed Successfully!', description: 'Thank you for your purchase!' });
      navigate('/order-confirmation');
    } catch {
      toast({ title: 'Payment Failed', description: 'Try again later.', variant: 'destructive' });
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" /> Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputGroup id="email" label="Email Address" value={formData.email} onChange={handleInputChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup id="firstName" label="First Name" value={formData.firstName} onChange={handleInputChange} />
                    <InputGroup id="lastName" label="Last Name" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                  <InputGroup id="phone" label="Phone Number" value={formData.phone} onChange={handleInputChange} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputGroup id="address" label="Street Address" value={formData.address} onChange={handleInputChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup id="city" label="City" value={formData.city} onChange={handleInputChange} />
                    <InputGroup id="state" label="State" value={formData.state} onChange={handleInputChange} />
                  </div>
                  <InputGroup id="zipCode" label="ZIP Code" value={formData.zipCode} onChange={handleInputChange} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputGroup id="nameOnCard" label="Name on Card" value={formData.nameOnCard} onChange={handleInputChange} />
                  <InputGroup id="cardNumber" label="Card Number" value={formData.cardNumber} onChange={handleCardNumberChange} maxLength={19} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup id="expiryDate" label="Expiry Date" value={formData.expiryDate} onChange={handleExpiryDateChange} maxLength={5} />
                    <InputGroup id="cvv" label="CVV" value={formData.cvv} onChange={handleInputChange} maxLength={4} />
                  </div>
                </CardContent>
              </Card>
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

                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Complete Order
                        </div>
                      )}
                    </Button>

                    <p className="text-sm text-center text-gray-600 flex items-center justify-center gap-1 mt-2">
                      <Lock className="w-3 h-3" /> Your payment info is secure.
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
