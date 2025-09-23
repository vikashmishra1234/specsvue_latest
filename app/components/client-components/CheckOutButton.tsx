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
      const data = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        name: 'Specsvue',
        description: 'Test Payment',
        order_id: data.id,
        handler: async function (response: any) {
          const body = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount,
            userId,
          };

          try {
            setIsLoading(true);
            const verifyRes = await axios.post('/api/razor-pay-verify', body);
            const verifyData = verifyRes.data;

            if (verifyData.verified) {
               handlePlaceOrder(addressId, response.razorpay_payment_id, router);
            } else {
              Swal.fire({
                icon: 'error',
                title: '❌ Payment verification failed.',
              });
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Something went wrong while verifying payment.',
            });
          } finally {
            setIsLoading(false); // ✅ always stop loading at end of verification
          }
        },
        prefill: {
          name: 'vikash mishra',
          email: 'vikash@example.com',
          contact: '9999999999',
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
        text: 'Something went wrong during checkout.',
      });
      setIsLoading(false);
    }
  }
};

const handlePlaceOrder = async (
  addressId: string,
  razorpay_payment_id: string,
  router: any
) => {
  try {
    const res = await axios.post("/api/place-order", { addressId, razorpay_payment_id });

    if (res.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Order successful',
      });
      router.push('/proceed-to-payment/summary');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: res.data.message || "Order failed.",
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Something went wrong while placing the order.',
    });
    console.error(err);
  }
};
