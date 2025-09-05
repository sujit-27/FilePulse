import { Copy, Download, EyeIcon, FileIcon, FileText, Globe, GlobeIcon, Image, Lock, LockIcon, Music, Trash2, Video } from 'lucide-react';
import React, { useState } from 'react'

const FileCard = ({file,onDelete,onTogglePublic,onDownload,onShareLink}) => {

    const [showActions , setShowActions] = useState(false);

    const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        console.log(extension);
        
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

    const formatFileSize = (bytes) => {
        if(bytes < 1024) return bytes+ 'B';
        else if (bytes < 1048576) return (bytes/1024).toFixed(1) + 'KB';
        else return (bytes / 10248576).toFixed(1) + 'MB';
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {year: 'numeric',month: 'short' , day: 'numeric'});
    }

    return (
        <>
            <div 
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
                className='relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100'>
                <div className='h-32 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center p-4'>
                    {getFileIcon(file)}
                </div>
                <div className='absolute top-2 right-2'>
                    <div className={`rounded-full p-1.5 ${file.public ? 'bg-green-100': 'bg-gray-100'}`} title={file.public ? "Public" : "Private"}>
                        {file.public ? (
                            <Globe size={14} className='text-green-600'/>
                        ):(
                            <Lock size={14} className="text-gray-600"/>
                        )}
                    </div>
                </div>

                <div className='p-4'>
                    <div className='flex justify-between items-start'>
                        <div className='overflow-hidden'>
                            <h3 title={file.name} className='font-semibold text-gray-900 truncate'>
                                {file.name}
                            </h3>
                            <div className='flex gap-2'>
                                <p className='text-xs text-gray-500 mt-2'>
                                {formatFileSize(file.size)} 
                                </p>
                                <p className='text-xs text-gray-500 mt-2'>
                                    {formatDate(file.uploadedAt)} 
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                    <div className='flex gap-3 w-full justify-center'>
                        {file.public && (
                            <button
                                onClick={() => onShareLink(file.id)}
                                title='Share Link'
                                className='p-2 bg-white/90 rounded-full hover::bg-white transition-colors text-blue-600 hover:text-blue-700'>
                                    <Copy size={18} className='cursor-pointer'/>
                                </button>
                        )}
                        {file.public && (
                            <a href={`/file/public/${file.id}`} title='View File' target='_blank' rel='noreferrer' className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-gray-700 hover:text-gray-900'>
                                <EyeIcon size={18}/>
                            </a>
                        )}

                        <button 
                            onClick={() => onDownload(file)}
                            title='Download'
                            className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-green-600 hover:text-green-700 cursor-pointer'>
                            <Download size={18}/>
                        </button>

                        <button
                            onClick={() => onTogglePublic(file)}
                            title={file.public ? "Make Private" : "Make Public"} 
                            className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-amber-600 hover:text-amber-700 cursor-pointer'>
                            {file.public ? <LockIcon size={18}/> : <GlobeIcon size={18}/>}
                        </button>

                        <button
                            title='Delete' 
                            onClick={() => onDelete(file.id)}
                            className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-red-600 hover:text-red-700 cursor-pointer'>
                            <Trash2 size={18}/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FileCard;
