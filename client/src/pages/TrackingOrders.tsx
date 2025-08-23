// src/pages/TrackingOrders.tsx (REPLACE ENTIRE FILE)

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Loader2, CheckCircle, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL;

// ... (StatusStep component remains the same)

export default function TrackingOrders() {
  const navigate = useNavigate();
  const location = useLocation();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // This will now hold the full order object, not just the ID
  const [order, setOrder] = useState<any>(location.state?.order || null);
  const [status, setStatus] = useState<'loading' | 'polling' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderIdFromUrl = params.get('order_id');

    const initializeOrder = async () => {
      // SCENARIO 1: Coming from "My Account" page (order object is in state)
      if (order) {
        // If we already have the order and it has tracking, we don't need to poll.
        if (order.shipmentDetails?.awbCode) {
          const trackingUrl = `https://shiprocket.co/tracking/${order.shipmentDetails.awbCode}`;
          window.location.href = trackingUrl;
        } else {
          // If no tracking yet, start polling for it.
          setStatus('polling');
        }
        return;
      }

      // SCENARIO 2: Coming from Razorpay redirect (orderId is in URL)
      if (orderIdFromUrl) {
        try {
          const response = await axios.get(`${API_URL}/api/orders/${orderIdFromUrl}`, { withCredentials: true });
          setOrder(response.data);
          setStatus('polling');
        } catch (err) {
          setStatus('error');
          setErrorMessage("Could not fetch order details for the given ID.");
        }
        return;
      }
      
      // SCENARIO 3: Arrived here with no data
      setStatus('error');
      setErrorMessage("No Order ID found. Cannot track status.");
    };

    initializeOrder();

  }, [location.search, location.state, order]);

  // Polling logic remains the same, but now it uses the `order._id` from state
  useEffect(() => {
    if (status !== 'polling' || !order?._id) {
      return;
    }

    const pollOrderStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders/${order._id}`, { withCredentials: true });
        const updatedOrder = response.data;

        const awbCode = updatedOrder?.shipmentDetails?.awbCode;
        if (awbCode) {
          setStatus('success');
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          
          const trackingUrl = `https://shiprocket.co/tracking/${awbCode}`;
          window.location.href = trackingUrl;
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    pollingIntervalRef.current = setInterval(pollOrderStatus, 3000);

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [status, order]);


  // --- RENDER LOGIC ---
  if (status === 'loading') {
    return <div className="text-center p-10"><Loader2 className="animate-spin inline-block mr-2" />Loading order details...</div>;
  }
  
  if (status === 'error') {
     return (
       <div className="bg-background min-h-screen flex items-center justify-center p-4">
         <div className="bg-card p-8 rounded-lg border shadow-lg max-w-md w-full text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">An Error Occurred</h1>
            <p className="text-muted-foreground mb-6">{errorMessage}</p>
            <Button onClick={() => navigate('/account')}>Go to My Account</Button>
         </div>
       </div>
    );
  }

  // Polling and Success views
  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-lg border shadow-lg max-w-md w-full text-center">
        {status === 'polling' && (
          <>
            <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin mb-6" />
            <h1 className="text-2xl font-bold mb-2">Processing Your Order</h1>
            <p className="text-muted-foreground mb-8">
              We are now generating your shipping label. This page will redirect automatically. Please wait...
            </p>
          </>
        )}
        {status === 'success' && (
           <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Shipment Ready!</h1>
            <p className="text-muted-foreground">Redirecting you to the tracking page...</p>
          </>
        )}
      </div>
    </div>
  );
}