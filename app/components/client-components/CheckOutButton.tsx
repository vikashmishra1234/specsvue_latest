import axios from 'axios';
import Swal from 'sweetalert2';

export const handleCheckout = async (
  amount: number,
  userId: string,
  addressId: string,
  router: any,
  setIsLoading: (value: boolean) => void
) => {
  if (amount && userId && addressId) {
    try {
      setIsLoading(true);
      const res = await axios.post('/api/razor-pay-order', { amount });
      setIsLoading(false);
      const data = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        name: 'Specsvue',
        description: 'Order Payment',
        order_id: data.id,
        handler: async function (response: any) {
          const body = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount,
            userId,
            addressId, // ✅ Pass addressId here for atomic order placement
          };

          try {
            setIsLoading(true);
            const verifyRes = await axios.post('/api/razor-pay-verify', body);
            setIsLoading(false);
            const verifyData = verifyRes.data;

            if (verifyData.verified) {
              if (verifyData.orderPlaced) {
                  // ✅ Success! Order placed.
                  Swal.fire({
                    icon: 'success',
                    title: 'Order successful',
                    timer: 2000,
                    showConfirmButton: false
                  });
                  router.push('/user');
              } else if (verifyData.refundInitiated) {
                  // ⚠️ Payment received but order failed (stock etc.) -> Auto Refunded
                  Swal.fire({
                    icon: 'warning',
                    title: 'Order Failed',
                    text: verifyData.error || 'Payment received but order could not be placed. Refund initiated.',
                    footer: 'Please check your email for refund details.'
                  });
              } else {
                   // ❌ Should typically not happen unless server error with NO refund
                   Swal.fire({
                    icon: 'error',
                    title: 'Order Processing Error',
                    text: verifyData.error || 'Payment verified but order creation failed. Please contact support.',
                  });
              }
            } else {
              Swal.fire({
                icon: 'error',
                title: '❌ Payment verification failed.',
                text: verifyData.error
              });
            }
          } catch (error: any) {
            console.error("Verification error:", error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response?.data?.error || 'Something went wrong while verifying payment.',
            });
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: 'Specsvue User',
          contact: '',
        },
        theme: {
          color: '#6366f1',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Checkout failed:", error);
      Swal.fire({
        icon: 'error',
        title: 'Checkout Failed',
        text: 'Something went wrong during checkout initialization.',
      });
      setIsLoading(false);
    }
  }
};
