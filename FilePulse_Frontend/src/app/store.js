import { configureStore } from '@reduxjs/toolkit';
import filesReducer from '../features/filesSlice';
import downloadReducer from '../features/downloadSlice';
import deleteReducer from "../features/deleteSlice"
import creditsReducer from "../features/creditsSlice"
import uploadReducer from "../features/uploadSlice"
import paymentReducer from "../features/paymentSlice"
import transactionReducer from "../features/transactionSlice"
import publicViewReducer from "../features/publicViewSlice"

export const store = configureStore({
  reducer: {
    files: filesReducer,
    download: downloadReducer,
    delete: deleteReducer,
    credits: creditsReducer,
    upload: uploadReducer,
    payment: paymentReducer,
    transactions: transactionReducer,
    publicView: publicViewReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
