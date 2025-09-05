import axios from 'axios';
import { CopyIcon, Download, File, Info, Share2Icon } from 'lucide-react';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import LinkShareModal from './LinkShareModal';
import { 
  fetchPublicFile, 
  downloadFile, 
  openShareModal, 
  closeShareModal, 
  clearDownloadError 
} from '../features/publicViewSlice';

const PublicFileView = () => {
  const dispatch = useDispatch();
  const { fileId } = useParams();

  // Select all needed state from Redux slice
  const { 
    file,
    loadingFile,
    errorFile,
    downloading,
    errorDownload,
    shareModal
  } = useSelector(state => state.publicView);

  useEffect(() => {
    dispatch(fetchPublicFile(fileId));
  }, [dispatch, fileId]);

  const handleDownload = () => {
    if (!file) return;

    dispatch(downloadFile({ fileId, filename: file.name }))
      .unwrap()
      .then(({ blob, filename }) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename || "downloaded-file");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        setTimeout(() => dispatch(clearDownloadError()), 3000);
      });
  };

  if (loadingFile) {
    return (
      <div className='flex justify-center items-center h-screen bg-gray-50'>
        <p className='text-gray-600'> Loading file...</p>
      </div>
    );
  }

  if (errorFile) {
    return (
      <div className='flex justify-center items-center h-screen bg-gray-50'>
        <div className='text-center p-8 bg-white rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold text-red-600'>Error</h2>
          <p className='text-gray-600 mt-2'>{errorFile}</p>
        </div>
      </div>
    );
  }

  if (!file) return null;

  return (
    <>
      <div className='bg-gray-50 min-h-screen'>
        <header className='p-4 border-b bg-white'>
          <div className='container mx-auto flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Share2Icon className='text-purple-600' />
              <span className='font-bold text-xl text-gray-800'>FilePulse</span>
            </div>
            <button 
              onClick={() => dispatch(openShareModal(window.location.href))}
              className='flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100'
            >
              <CopyIcon size={18}/>
              Share Link
            </button>
          </div>
        </header>
        <main className='container mx-auto p-4 md:p-8 flex justify-center'>
          <div className='w-full max-w-3xl'>
            <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center'>
              <div className='flex justify-center mb-4'>
                <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center'>
                  <File size={40} className="text-blue-500"/>
                </div>
              </div>

              <h1 className='text-2xl font-semibold text-gray-800 break-words'>
                {file.name}
              </h1>
              <p className='text-sm text-gray-500 mt-2'>
                {(file.size / 1024).toFixed(2)} KB
                <span className='mx-2'>&bull;</span>
                Shared on {new Date(file.uploadedAt).toLocaleDateString()}
              </p>

              <div className='my-6'>
                <span className='inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-lg'>
                  {file.type || "File"}
                </span>
              </div>

              <div className='flex justify-center gap-4 my-8'>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className='flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg cursor-pointer disabled:opacity-60'
                >
                  <Download size={18}/>
                  {downloading ? "Downloading..." : "Download File"}
                </button>
              </div>

              {errorDownload && (
                <p className='text-red-600 text-sm mb-4'>{errorDownload}</p>
              )}

              <hr className='my-8'/>

              <div>
                <h3 className='text-lg font-semibold text-left text-gray-800 mb-4'>File Information</h3>
                <div className='text-left text-sm space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'> File Name:</span>
                    <span className='text-gray-800 font-semibold break-all'>{file.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'> File Type:</span>
                    <span className='text-gray-800 font-semibold'>{file.type}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'> File Size:</span>
                    <span className='text-gray-800 font-semibold'>{(file.size / 1024).toFixed(2)} KB</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Shared:</span>
                    <span className='text-gray-800 font-semibold'>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className='mt-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex justify-center items-center gap-1'>
                <Info size={20}/>
                <p className='text-sm'>
                  This file has been shared publicly. Anyone with this link can view and download it.
                </p>
              </div>
            </div>
          </div>
        </main>

        <LinkShareModal
          isOpen={shareModal.isOpen}
          onClose={() => dispatch(closeShareModal())}
          link={shareModal.link}
          title='Share File'
        />
      </div>
    </>
  )
}

export default PublicFileView
