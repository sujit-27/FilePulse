import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const deleteFile = createAsyncThunk(
  'delete/deleteFile',
  async ({ fileId, token }, thunkAPI) => {
    try {
      const response = await axios.delete(`https://filepulse.onrender.com/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (response.status === 204) {
        return fileId;
      }
      return thunkAPI.rejectWithValue("Failed to delete file");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const deleteSlice = createSlice({
  name: 'delete',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    resetDeleteError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetDeleteError } = deleteSlice.actions;

export default deleteSlice.reducer;
