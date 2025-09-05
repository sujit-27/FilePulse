import React from 'react'
import Modal from './Modal'

const ConfirmationDialog = (
    {
        isOpen,
        onClose,
        title="Confirm Action", 
        message="Are you sure you want to proceed?",
        confirmText = "Confirm",
        cancelText="Cancel",
        onConfirm,
        confirmationButtonClass=""
    }) => {
  return (
    <>
      <Modal 
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={onConfirm}
        size="sm"
        confirmationButtonClass={confirmationButtonClass}
      />
      {/* <p className='text-gray-600'>{message}</p> */}
    </>
  )
}

export default ConfirmationDialog
