import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (getToken, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await axios.get("http://localhost:8080/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // array of transactions
    } catch (error) {
      return rejectWithValue("Failed to load your transaction history. Please try again later.");
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch transactions";
      });
  }
});

export default transactionSlice.reducer;
