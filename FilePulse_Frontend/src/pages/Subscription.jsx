import React, { useEffect, useRef } from 'react'
import DashboardLayout from '../Layout/DashboardLayout'
import { useAuth, useUser } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCredits } from '../features/creditsSlice';
import { initiatePayment, verifyPayment, setMessage, setRazorpayLoaded } from '../features/paymentSlice';
import { AlertCircle, Check, CreditCard, Loader2 } from 'lucide-react';

const Subscription = () => {
  const { getToken, isSignedIn } = useAuth();
  const dispatch = useDispatch();
  const razorScriptRef = useRef();
  const credits = useSelector(state => state.credits.credits);
  const payment = useSelector(state => state.payment);
  const { user } = useUser();

  let name = 'User';
  let email = '';
  if (user) {
    name = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
    const primaryEmail = user.emailAddresses?.find(e => e.id === user.primaryEmailAddressId);
    email = primaryEmail ? primaryEmail.emailAddress : (user.emailAddresses?.[0]?.emailAddress || '');
  }

  // Fetch credits on login
  useEffect(() => {
    if (isSignedIn) {
      dispatch(fetchUserCredits({ getToken, isSignedIn }));
    }
  }, [dispatch, getToken, isSignedIn]);

  // Load Razorpay script and set loaded state in Redux
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => dispatch(setRazorpayLoaded(true));
      script.onerror = () => dispatch(setMessage({
        message: "Payment gateway failed to load. Please refresh.",
        type: "error"
      }));
      document.body.appendChild(script);
      razorScriptRef.current = script;
    } else {
      dispatch(setRazorpayLoaded(true));
    }
    return () => {
      if (razorScriptRef.current && document.body.contains(razorScriptRef.current)) {
        document.body.removeChild(razorScriptRef.current);
      }
    };
  }, [dispatch]);

  // Purchase plan flow (async thunks)
  const handlePurchase = async (plan) => {
    if (!payment.razorpayLoaded) {
      dispatch(setMessage({
        message: "Payment gateway is still loading. Please wait a moment and try again.",
        type: "error"
      }));
      return;
    }

    try {
      const result = await dispatch(initiatePayment({
        plan, name, email, getToken, isSignedIn
      })).unwrap();

      // Razorpay options and handler for payment verification
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: plan.price * 100,
        currency: "INR",
        name: "FilePulse",
        description: `Purchase ${plan.credits} credits`,
        order_id: result.orderId,
        handler: async function (response) {
          dispatch(verifyPayment({
            response,
            plan,
            token: result.token,
            getToken,
            isSignedIn
          }));
        },
        prefill: { name, email },
        theme: { color: "#3B82F6" }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      // Error already set in Redux slice
    }
  };

  const plans = payment.plans;

  return (
    <DashboardLayout activeMenu="Subscription">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-1 tracking-tight">Subscription Plans</h1>
        <p className="text-gray-700 mb-8 text-base">Choose a plan that works for you</p>

        {payment.message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 shadow-sm
              ${payment.messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200'
                : payment.messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'}`}
          >
            {payment.messageType === 'error' && <AlertCircle size={20}/>}
            <span className='font-medium'>{payment.message}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="w-full md:max-w-md bg-blue-50 p-7 rounded-2xl shadow-md flex flex-col gap-3 border border-blue-100 hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="text-blue-600" />
              <h2 className="text-lg font-semibold">
                Current Credits:&nbsp;<span className="font-bold text-blue-700">{credits}</span>
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              You can upload <span className="font-semibold text-blue-700">{credits}</span> more files with your current credits.
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative border rounded-2xl p-8 transition duration-150
                ${plan.recommended ? 'border-blue-300 bg-blue-100 shadow-lg'
                  : 'border-gray-200 bg-white shadow-sm hover:shadow-md'}`}
            >
              {plan.recommended && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold rounded px-3 py-1 shadow">
                  RECOMMENDED
                </div>
              )}
              <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
              <div className="flex items-end mb-5 gap-3">
                <span className="text-4xl font-bold text-blue-800">₹{plan.price}</span>
                <span className="text-gray-500 ml-1 text-lg">for {plan.credits} credits</span>
              </div>
              <ul className="space-y-3 mb-8 mt-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-base">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePurchase(plan)}
                disabled={payment.processingPayment}
                className={`w-full py-3 rounded-lg font-semibold shadow transition-colors duration-100 ${
                  plan.recommended
                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                    : 'bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 mt-17 cursor-pointer'
                } disabled:opacity-60 flex items-center justify-center gap-2 text-lg`}
              >
                {payment.processingPayment ? (
                  <>
                    <Loader2 size={18} className='animate-spin' />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Purchase Plan</span>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-2">How credits work</h3>
          <p className="text-sm text-gray-600">
            Each file upload consumes 1 credit. New users start with <span className="font-semibold">5 free credits</span>.
            Credits never expire and can be used at any time. If you run out of credits, you can purchase more through one of our plans above.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
