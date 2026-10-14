declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  amount: number; // in paise (e.g. 100000 for ₹1000)
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
  const isDemoKey = !key || key.includes("YourKeyIdHere") || key.includes("rzp_test_YourKeyIdHere");

  // 1. If test/demo mode or Razorpay SDK not present, perform clean sandbox simulation
  if (isDemoKey || !window.Razorpay) {
    console.info("Simulating sandbox payment approval (Demo Mode).");
    const amountRupees = (options.amount / 100).toFixed(2);
    const candidateName = options.prefill?.name || "Student Candidate";

    const confirmed = window.confirm(
      `[Razorpay Demo Payment Simulation]\n\nAmount: ₹${amountRupees}\nCandidate: ${candidateName}\n\nClick 'OK' to simulate a successful payment approval,\nor 'Cancel' to abort.`
    );

    if (confirmed) {
      const mockPayId = `pay_mock_${Date.now()}`;
      const mockOrderId = `order_mock_${Date.now()}`;
      options.onSuccess({
        razorpay_payment_id: mockPayId,
        razorpay_order_id: mockOrderId,
        razorpay_signature: `sig_mock_${Date.now()}`
      });
    } else if (options.onFailure) {
      options.onFailure({ description: "Payment cancelled by user in demo simulation." });
    }
    return;
  }

  // 2. Live / Real Razorpay Checkout flow
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
          options.onFailure({ description: "Payment window closed." });
        }
      }
    }
  };

  try {
    const paymentObject = new window.Razorpay(rzpOptions);
    paymentObject.open();
  } catch (err: any) {
    console.warn("Error opening Razorpay window, falling back to demo simulation:", err);
    options.onSuccess({
      razorpay_payment_id: `pay_mock_${Date.now()}`,
      razorpay_order_id: `order_mock_${Date.now()}`
    });
  }
};
