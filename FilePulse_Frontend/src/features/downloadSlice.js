import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to download a file by ID
export const downloadFile = createAsyncThunk(
  'download/downloadFile',
  async ({ fileId, token, fileName }, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:8080/files/download/${fileId}`, { 
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Create blob URL and auto-download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { fileId, success: true };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const downloadSlice = createSlice({
  name: 'download',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    resetError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetError } = downloadSlice.actions;
export default downloadSlice.reducer;
