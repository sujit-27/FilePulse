import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for file upload
export const uploadFiles = createAsyncThunk(
  'upload/uploadFiles',
  async ({ files, token }, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));      
      const response = await axios.post('https://filepulse.onrender.com/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data && response.data.remainingCredits !== undefined) {
        dispatch({ type: 'credits/updateCredits', payload: response.data.remainingCredits });
      }

      return { message: 'Files uploaded successfully!' };
    } catch (error) {
      console.error('Upload error response:', error.response);
      return rejectWithValue(error.response?.data?.message || 'Error uploading the files. Please try again.');
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    uploading: false,
    message: '',
    messageType: ''
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload.message || '';
      state.messageType = action.payload.type || '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.uploading = true;
        state.message = 'Uploading files...';
        state.messageType = 'info';
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.uploading = false;
        state.message = action.payload.message;
        state.messageType = 'success';
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.uploading = false;
        state.message = action.payload || 'Upload failed';
        state.messageType = 'error';
      });
  }
});

export const { setMessage } = uploadSlice.actions;
export default uploadSlice.reducer;
