import React, { useEffect, useState } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import { useAuth } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import { fetchUserCredits } from '../features/creditsSlice';
import { setMessage, uploadFiles } from '../features/uploadSlice';

const MAX_FILES = 5;

const Upload = () => {
  const [localFiles, setLocalFiles] = useState([]);
  const { uploading, message, messageType } = useSelector(state => state.upload);
  const credits = useSelector(state => state.credits.credits);
  const { getToken, isSignedIn } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSignedIn) {
      dispatch(fetchUserCredits({ getToken, isSignedIn }));
    }
  }, [dispatch, getToken, isSignedIn]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log(selectedFiles);
    setLocalFiles(selectedFiles);
  };

  const handleRemoveFile = (index) => {
    setLocalFiles(prev => prev.filter((_, i) => i !== index));
  };

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

    try {
      const token = await getToken({ template: "backend" });
      dispatch(uploadFiles({ files: localFiles, token }));
      setLocalFiles([]);
    } catch (err) {
      dispatch(setMessage({ message: 'Failed to get authentication token.', type: 'error' }));
    }
  };

  const isUploadDisabled = uploading || localFiles.length === 0 || localFiles.length > MAX_FILES || credits <= 0 || localFiles.length > credits;

  return (
    <DashboardLayout activeMenu="Upload">
      <div className='p-6'>
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            messageType === 'error' ? 'bg-red-50 text-red-700' :
              messageType === 'success' ? 'bg-green-50 text-green-700' :
                'bg-blue-50 text-blue-700'
          }`}>
            {messageType === 'error' && <AlertCircle size={20} />}
            {message}
          </div>
        )}

        <UploadBox
          files={localFiles}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          uploading={uploading}
          onRemoveFile={handleRemoveFile}
          remainingCredits={credits}
          isUploadDisabled={isUploadDisabled}
        />
      </div>
    </DashboardLayout>
  );
};

export default Upload;
