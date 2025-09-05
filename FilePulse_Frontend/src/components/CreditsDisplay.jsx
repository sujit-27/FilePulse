import { CreditCardIcon } from 'lucide-react'
import React from 'react'

const CreditsDisplay = ({credits}) => {
  return (
    <>
      <div className='flex items-center gap-1 bg-blue-100 py-1 px-3 rounded-full text-blue-800'>
        <CreditCardIcon size={16}/>
        <span className='font-semibold'>{credits}</span>
        <span className='text-sm font-semibold'>Credits</span>
      </div>
    </>
  )
}

export default CreditsDisplay
