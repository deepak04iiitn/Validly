import { useState } from 'react';
import { toast } from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, onSuccess, jobData }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePayment = async () => {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      const orderResponse = await fetch('/backend/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: 10000 }) // ₹100 = 10000 paise
      });

      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message);
      }

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Job Portal',
        description: 'Payment for Job Posting',
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('/backend/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                jobData
              })
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              toast.success('Payment successful! Job posted.');
              onSuccess(verifyData.jobId);
              onClose();
            } else {
              throw new Error(verifyData.message);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'Job Poster',
          email: 'user@example.com'
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        toast.error('Payment failed. Please try again.');
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            To post your job listing, please complete the payment of:
          </p>
          <div className="text-3xl font-bold text-green-600 mb-4">₹100</div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Job Details:</h3>
            <p><strong>Title:</strong> {jobData?.title}</p>
            <p><strong>Company:</strong> {jobData?.company}</p>
            <p><strong>Location:</strong> {jobData?.location}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="cursor-pointer flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay ₹100'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;