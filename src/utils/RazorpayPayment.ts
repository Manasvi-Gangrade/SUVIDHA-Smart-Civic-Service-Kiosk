export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export interface RazorpayPaymentOptions {
  keyId: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  themeColor?: string;
  onSuccess: (response: {
    razorpay_payment_id: string;
  }) => void;
  onFailure: (error: any) => void;
}

export const startRazorpayPayment = async (options: RazorpayPaymentOptions) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    options.onFailure({
      description: 'Razorpay SDK failed to load.'
    });
    return;
  }

  const checkoutOptions = {
    key: options.keyId,
    amount: options.amount,
    currency: options.currency,
    name: options.name,
    description: options.description,
    prefill: options.prefill,
    theme: {
      color: options.themeColor || '#192e59',
    },
    handler: function (response: any) {
      options.onSuccess({
        razorpay_payment_id: response.razorpay_payment_id,
      });
    },
  };

  const rzp = new (window as any).Razorpay(checkoutOptions);
  rzp.open();
};
