import React, { useEffect, useState } from 'react'
import DashboardLayout from '../Layout/DashboardLayout'
import { Copy, Download, Eye, File, FileIcon, FileText, Globe, Grid, Image, List, Lock, Music, Trash2, Video } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FileCard from '../components/FileCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFiles, togglePublic } from '../features/filesSlice';
import { downloadFile, resetError } from '../features/downloadSlice';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { deleteFile, resetDeleteError } from '../features/deleteSlice';
import LinkShareModal from '../components/LinkShareModal';

const MyFiles = () => {

  const [viewMode, setViewMode] = useState("grid");
  const {getToken} = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    fileId:null
  });
  const [shareModal, setShareModal] = useState({
    isOpen:false,
    fileId:null,
    link:""
  });

  const files = useSelector(state => state.files.items);
  const error = useSelector(state => state.files.error);
  const downloadError = useSelector(state => state.download.error);
  const deleteError = useSelector(state => state.delete.error);

  useEffect(() => {
    const loadFiles = async () => {
      const token = await getToken();
      dispatch(fetchFiles(token));
    };
    loadFiles();
  }, [dispatch, getToken]);

  useEffect(() => {
    if (error) {
      toast.error("Error: " + error);
    }
  }, [error]);

  useEffect(() => {
    if (deleteError) {
      toast.error("Delete error: " + deleteError);
      dispatch(resetDeleteError());
    }
  }, [deleteError, dispatch]);

  const handleTogglePublic = async (file) => {
    const token = await getToken();
    dispatch(togglePublic({ fileId: file.id, token }));
  };

  useEffect(() => {
    if (downloadError) {
      toast.error('Download error: ' + downloadError);
      dispatch(resetError());
    }
  }, [downloadError, dispatch]);

  const handleDownload = async (file) => {
    const token = await getToken();
    dispatch(downloadFile({ fileId: file.id, token, fileName: file.name }));
  };

  const getFileIcon = (file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      
      if(['jpg' , 'jpeg' , 'png' , 'gif' , 'svg' , 'webp' , 'avif'].includes(extension)){
          return <Image size={24} className="text-blue-600"/>
      }

      if(['mp4', 'webm', 'mov' , 'avi', 'mkv'].includes(extension)){
          return <Video size={24} className="text-purple-600"/>
      }

      if(['mp3' , 'wav' , 'ogg' , 'flac' , 'm4a'].includes(extension)){
          return <Music size={24} className="text-pink-600"/>
      }

      if(['pdf','doc' , 'docx','txt','rtf'].includes(extension)){
          return <FileText size={24} className="text-amber-600"/>
      }

      return <FileIcon size={24} className='text-purple-500'/>

  }

  const closeDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      fileId:null
    })
  }

  const handleDelete = async () => {
    const fileId  = deleteConfirmation.fileId;
    if (!fileId) return;

    try {
      const token = await getToken();
      await dispatch(deleteFile({ fileId, token })).unwrap();
      toast.success("File deleted successfully");
      closeDelete();
      dispatch(fetchFiles(token));
    } catch (error) {
      console.error("Error deleting the file ", error)
      toast.error("Error deleting file",error.message)
    }
  }; 

  const openDeleteConfirmation = (fileId) => {
    setDeleteConfirmation({
      isOpen:true,
      fileId:fileId
    })
  }

  const openShareLinkModal = (fileId) => {
    const link = `${window.location.origin}/file/public/${fileId}`;
    setShareModal({
      isOpen:true,
      fileId,
      link
    })
  }

  const closeShareLinkModal = () => {
    setShareModal({
      isOpen:false,
      fileId:null,
      link:""
    })
  }

  return (
    <>
      <DashboardLayout activeMenu="My Files">
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>My Files (<span className='text-gray-700'>{files.length}</span>)</h2>
            <div className='flex items-center gap-3'>
              <List 
                onClick={() => setViewMode("list")}
                size={24}
                className={`hidden sm:block cursor-pointer transition-colors ${viewMode === 'list' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}/>
              <Grid
                size={24} 
                onClick={() => setViewMode("grid")}
                className={`hidden sm:block cursor-pointer transition-colors ${viewMode === "grid" ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}/>
            </div>
          </div>

          {files.length === 0 ? (
            <div className='bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center'>
              <File 
                size={60}
                className="text-blue-400 mb-4"
              />
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                No files Uploaded yet
              </h3>
              <p className='text-gray-500 text-center max-w-md mb-6'>
                Start uploading files to see them listed here. You can upload documents, images, and other files to share and manage them securely.
              </p>

              <button
                onClick={() => navigate("/upload")} 
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer'>
                Go to Upload
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7'>
              {files.map((file) => (
                <FileCard 
                  key={file.id} 
                  file={file} 
                  onDelete={openDeleteConfirmation}
                  onTogglePublic={handleTogglePublic}
                  onDownload={handleDownload}
                  onShareLink={openShareLinkModal}
                />
              ))}
            </div>
          ) : (
            <div className='hidden sm:block overflow-x-auto bg-white rounded-lg shadow'>
              <table className='min-w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Name</th>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Size</th>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Uploaded</th>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Sharing</th>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'> Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {files.map((file) => (
                    <tr key={file.id} className='hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800'>
                        <div className='flex items-center gap-2'>
                          {getFileIcon(file)}
                          {file.name}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800'>
                        {(file.size / 1024).toFixed(1)} KB
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800'>
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800'>
                        <div className='flex items-center gap-4'>
                          <button 
                            onClick={() => handleTogglePublic(file)}
                            className='flex items-center gap-2 cursor-pointer group'>
                              {file.public ? (
                                <>
                                  <Globe size={16} className="text-green-500"/>
                                  <span className='group-hover:underline'>
                                    Public
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Lock size={16} className="text-gray-500"/>
                                  <span className='group-hover:underline'>
                                    Private
                                  </span>
                                </>
                              )}
                            </button>
                            {file.public && (
                              <button 
                                onClick={() => openShareLinkModal(file.id)}
                                className='flex items-center gap-2 cursor-pointer group text-purple-600'>
                                <Copy size={16}/>
                                <span className='group-hover:underline'>
                                  Share Link
                                </span>
                              </button>
                            )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold'>
                        <div className='grid grid-cols-3 gap-4'>
                          <div className='flex justify-center'>
                            <button 
                              title='Download'
                              onClick={() => handleDownload(file)}
                              className='text-gray-500 hover:text-blue-600'>
                                <Download size={18} className='cursor-pointer'/>
                              </button>
                          </div>
                          <div className='flex justify-center'>
                            <button 
                              title='Delete'
                              onClick={() => openDeleteConfirmation(file.id)}
                              className='text-gray-500 hover:text-red-600'>
                                <Trash2 size={18} className='cursor-pointer'/>
                            </button>
                          </div>
                          <div className='flex justify-center'>
                            {file.public ? (
                              <a 
                                title='View File'
                                href={`/file/public/${file.id}`} 
                                target='_blank'
                                rel='noreferrer noopener'
                                className='text-gray-500 hover:text-purple-600'>
                                  <Eye size={18}/>
                              </a>
                            ) : (
                              <span className='w-[18px]'></span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <ConfirmationDialog
            isOpen={deleteConfirmation.isOpen}
            onClose={closeDelete}
            title='Delete File'
            message='Are you sure you want to delete this file? This action cannot be reversed.'
            confirmText='Delete'
            cancelText='Cancel'
            onConfirm={handleDelete}
            confirmationButtonClass='bg-red-600 hover:bg-red-500'
          />

          <LinkShareModal
            isOpen={shareModal.isOpen}
            onClose={closeShareLinkModal}
            link={shareModal.link}
            title = "Share Link"
          />
        </div>
      </DashboardLayout>
    </>
  )
}

export default MyFiles;
