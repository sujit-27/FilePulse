import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import { useAuth } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCredits } from '../features/creditsSlice';
import { fetchFiles } from '../features/filesSlice';
import { setMessage, uploadFiles } from '../features/uploadSlice';
import DashboardUploadBox from '../components/DashboardUploadBox';
import RecentFiles from '../components/RecentFiles';
import { Loader2 } from 'lucide-react';

const MAX_FILES = 5;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { getToken, isSignedIn } = useAuth();

  // LOCAL FILE STATE to hold actual File objects to avoid storing them in Redux
  const [localFiles, setLocalFiles] = useState([]);

  // Redux slices state for serializable info and files metadata
  const { uploading, message, messageType } = useSelector(state => state.upload);
  const credits = useSelector(state => state.credits.credits);
  const { items: allFiles, loading } = useSelector(state => state.files);

  // Remaining upload slots based on credits and max files
  const remainingUploads = Math.max(0, Math.min(MAX_FILES, credits || 0) - localFiles.length);

  // Memoized recent files sorted descending by uploadedAt, sliced top 5
  const recentFiles = useMemo(() => {
    if (!Array.isArray(allFiles)) return [];

    return [...allFiles]
      .filter(file => file.uploadedAt)  // filter out files without upload date
      .sort((a, b) => {
        const dateA = new Date(a.uploadedAt);
        const dateB = new Date(b.uploadedAt);

        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;

        return dateB - dateA; // descending newest first
      })
      .slice(0, 5);
  }, [allFiles]);

  useEffect(() => {
    if (isSignedIn) {
      dispatch(fetchUserCredits({ getToken, isSignedIn }));
      (async () => {
        const token = await getToken();
        dispatch(fetchFiles(token));
      })();
    }
  }, [dispatch, getToken, isSignedIn]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, remainingUploads);
    setLocalFiles(prev => [...prev, ...selectedFiles]);
  };

  // Remove file by index from local state
  const handleRemoveFile = (index) => {
    setLocalFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload files using thunk - pass local files and resolved token
  const handleUpload = async () => {
    if (localFiles.length === 0) {
      return dispatch(setMessage({ message: 'Please select at least one file to upload.', type: 'error' }));
    }
    if (localFiles.length > MAX_FILES) {
      return dispatch(setMessage({ message: `You can only upload a maximum of ${MAX_FILES} files at once.`, type: 'error' }));
    }
    if (localFiles.length > credits) {
      return dispatch(setMessage({ message: `You don't have enough credits to upload these files.`, type: 'error' }));
    }
    const token = await getToken({ template: "backend" });
    dispatch(uploadFiles({ files: localFiles, token }));
    setLocalFiles([]);
  };

  // Disable upload button logic based on local state and credits
  const isUploadDisabled = uploading || localFiles.length === 0 || localFiles.length > MAX_FILES || credits <= 0 || localFiles.length > credits;

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Drive</h1>
        <p className="text-gray-600 mb-6">Upload, manage, and share your files securely</p>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === 'error'
                ? 'bg-red-50 text-red-700'
                : messageType === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-purple-50 text-purple-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-[40%]">
            <DashboardUploadBox
              files={localFiles}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
              uploading={uploading}
              onRemoveFile={handleRemoveFile}
              remainingUploads={remainingUploads}
              isUploadDisabled={isUploadDisabled}
            />
          </div>

          <div className="w-full md:w-[60%]">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
                <Loader2 size={40} className="text-purple-500 animate-spin mb-4" />
                <p className="text-gray-500">Loading your files...</p>
              </div>
            ) : (
              <RecentFiles files={recentFiles} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
