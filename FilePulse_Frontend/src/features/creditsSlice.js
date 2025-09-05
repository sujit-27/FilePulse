import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Pass getToken and isSignedIn as thunk arguments
export const fetchUserCredits = createAsyncThunk(
  'credits/fetchUserCredits',
  async ({ getToken, isSignedIn }, { rejectWithValue }) => {
    try {
      if (!isSignedIn) return rejectWithValue('Not signed in');
      const token = await getToken();
      const response = await axios.get(
        'http://localhost:8080/users/credits',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) return response.data.credits;
      return rejectWithValue('Unexpected response status');
    } catch (err) {
      return rejectWithValue(err.message || 'Unknown error');
    }
  }
);

const creditsSlice = createSlice({
  name: 'credits',
  initialState: {
    credits: 5,
    loading: false,
    error: null
  },
  reducers: {
    updateCredits: (state, action) => {
      state.credits = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCredits.fulfilled, (state, action) => {
        state.credits = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { updateCredits } = creditsSlice.actions;
export default creditsSlice.reducer;
