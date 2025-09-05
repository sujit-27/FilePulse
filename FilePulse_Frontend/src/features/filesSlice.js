import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async (token, thunkAPI) => {
    try {
      // const token = await getToken();
      const response = await axios.get('https://filepulse.onrender.com/files/my', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const togglePublic = createAsyncThunk(
  'files/togglePublic',
  async ({fileId,token}, thunkAPI) => {
    try {
      await axios.patch(`https://filepulse.onrender.com/files/${fileId}/toggle-public`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return fileId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchFiles
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(togglePublic.fulfilled, (state, action) => {
        const id = action.payload;
        const file = state.items.find(f => f.id === id);
        if (file) {
          file.public = !file.public;
        }
      })
      .addCase(togglePublic.rejected, (state, action) => {
        state.error = action.payload;
      })
    },
});

export default filesSlice.reducer;
