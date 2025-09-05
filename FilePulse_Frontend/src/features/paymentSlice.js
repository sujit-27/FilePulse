import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Plans definition (can be fetched instead if needed)
const plans = [
  {
    id: "premium",
    name: "Premium",
    credits: 500,
    price: 499,
    features: [
      "Upload up to 500 files",
      "Access to all basic features",
      "Priority support"
    ],
    recommended: false
  },
  {
    id: "ultimate",
    name: "Ultimate",
    credits: 5000,
    price: 2499,
    features: [
      "Upload up to 5000 files",
      "Access to all premium features",
      "Priority support",
      "Advanced analytics"
    ],
    recommended: true
  }
];

// Async thunk for payment initiation & verification
export const initiatePayment = createAsyncThunk(
  'payment/initiatePayment',
  async ({ plan, name, email, getToken, isSignedIn }, { dispatch, rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await axios.post("http://localhost:8080/payments/create-order", {
        planId: plan.id,
        amount: plan.price * 100,
        currency: "INR",
        credits: plan.credits
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Prepare Razorpay options
      return {
        plan, token, orderId: response.data.orderId, name, email
      };
    } catch (error) {
      return rejectWithValue("Failed to initiate payment. Please try again later.");
    }
  }
);

// Async thunk for verifying payment after Razorpay callback
export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async ({ response, plan, getToken, isSignedIn }, { dispatch, rejectWithValue }) => {
    try {
      const token = await getToken();
      const verifyResponse = await axios.post('http://localhost:8080/payments/verify-payment', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        planId: plan.id
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (verifyResponse.data.success) {
        if (verifyResponse.data.credits != null) {
          dispatch({ type: 'credits/updateCredits', payload: verifyResponse.data.credits });
        } else {
          dispatch(fetchUserCredits({ getToken, isSignedIn }));
        }
        return { success: true, planName: plan.name };
      } else {
        return rejectWithValue("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      return rejectWithValue("Payment verification failed. Please contact support.");
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    processingPayment: false,
    message: '',
    messageType: '',
    plans: plans,
    razorpayLoaded: false,
    razorScriptAttached: false
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload.message;
      state.messageType = action.payload.type;
    },
    setRazorpayLoaded: (state, action) => {
      state.razorpayLoaded = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.processingPayment = true;
        state.message = "";
        state.messageType = "";
      })
      .addCase(initiatePayment.fulfilled, (state) => {
        state.processingPayment = false;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.processingPayment = false;
        state.message = action.payload;
        state.messageType = "error";
      })
      .addCase(verifyPayment.pending, (state) => {
        state.processingPayment = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.processingPayment = false;
        state.message = `Payment successful! ${action.payload.planName} plan activated.`;
        state.messageType = "success";
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.processingPayment = false;
        state.message = action.payload;
        state.messageType = "error";
      });
  }
});

export const { setMessage, setRazorpayLoaded } = paymentSlice.actions;
export default paymentSlice.reducer;
