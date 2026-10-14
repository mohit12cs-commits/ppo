declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  amount: number; // in paise (e.g. 99900 for ₹999)
  currency?: string;
  name?: string;
  description?: string;
  orderId?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess: (response: { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string }) => void;
  onFailure?: (error: any) => void;
}

export const openRazorpayCheckout = (options: RazorpayOptions) => {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

  if (!window.Razorpay) {
    alert("Razorpay SDK failed to load. Please verify your internet connection.");
    return;
  }

  // If live key is not yet set up, offer demo simulation
  if (!key || key.includes("YourKeyIdHere")) {
    console.info("Razorpay Key not set. Simulating sandbox payment approval.");
    const confirmed = window.confirm(
      `[Razorpay Demo Mode]\nAmount: ₹${(options.amount / 100).toFixed(2)}\nCandidate: ${options.prefill?.name || "Student"}\n\nClick OK to simulate a Successful Payment.`
    );
    if (confirmed) {
      options.onSuccess({
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_order_id: `order_mock_${Date.now()}`
      });
    } else if (options.onFailure) {
      options.onFailure({ description: "Payment cancelled by user in test mode" });
    }
    return;
  }

  const rzpOptions = {
    key: key,
    amount: options.amount,
    currency: options.currency || "INR",
    name: options.name || "Internship Portal",
    description: options.description || "Internship Program Enrollment Fee",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    order_id: options.orderId,
    prefill: {
      name: options.prefill?.name || "",
      email: options.prefill?.email || "",
      contact: options.prefill?.contact || "",
    },
    notes: options.notes || {},
    theme: {
      color: "#4f46e5",
    },
    handler: function (response: any) {
      options.onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        if (options.onFailure) {
          options.onFailure({ description: "Payment cancelled" });
        }
      }
    }
  };

  const paymentObject = new window.Razorpay(rzpOptions);
  paymentObject.open();
};
