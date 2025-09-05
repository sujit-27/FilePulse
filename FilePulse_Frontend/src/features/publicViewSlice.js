import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch public file info by fileId
export const fetchPublicFile = createAsyncThunk(
  'publicView/fetchPublicFile',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/files/public/${fileId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue("Could not retrieve file. The link may be invalid or the file may have been removed.");
    }
  }
);

// Download file thunk by fileId and filename
export const downloadFile = createAsyncThunk(
  'publicView/downloadFile',
  async ({ fileId, filename }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/files/download/${fileId}`,
        { responseType: 'blob' }
      );
      return { blob: response.data, filename };
    } catch (error) {
      return rejectWithValue("Sorry, the file could not be downloaded.");
    }
  }
);

const publicViewSlice = createSlice({
  name: 'publicView',
  initialState: {
    file: null,
    loadingFile: false,
    errorFile: null,
    downloading: false,
    errorDownload: null,
    shareModal: {
      isOpen: false,
      link: ''
    }
  },
  reducers: {
    openShareModal: (state, action) => {
      state.shareModal = {
        isOpen: true,
        link: action.payload
      };
    },
    closeShareModal: (state) => {
      state.shareModal = {
        isOpen: false,
        link: ''
      };
    },
    clearDownloadError: (state) => {
      state.errorDownload = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch file cases
      .addCase(fetchPublicFile.pending, (state) => {
        state.loadingFile = true;
        state.errorFile = null;
      })
      .addCase(fetchPublicFile.fulfilled, (state, action) => {
        state.loadingFile = false;
        state.file = action.payload;
        state.errorFile = null;
      })
      .addCase(fetchPublicFile.rejected, (state, action) => {
        state.loadingFile = false;
        state.errorFile = action.payload || 'Failed to fetch file.';
      })
      // Download file cases
      .addCase(downloadFile.pending, (state) => {
        state.downloading = true;
        state.errorDownload = null;
      })
      .addCase(downloadFile.fulfilled, (state) => {
        state.downloading = false;
        state.errorDownload = null;
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.downloading = false;
        state.errorDownload = action.payload || 'Download failed';
      });
  }
});

export const { openShareModal, closeShareModal, clearDownloadError } = publicViewSlice.actions;
export default publicViewSlice.reducer;
