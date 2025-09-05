import React from 'react'

import dashboard from "../../assets/Screenshot 2025-09-04 170108.png"

const Hero = ({openSignIn,openSignUp}) => {
  return (
    <>
      <div className='landing-page-content relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-100 opacity-80 z-0 pointer-events-none'>

        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            <div className='pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28'>
                <div className='text-center'>
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-800 sm:text-5xl md:text-6xl">
                        <span className="block">Share Files Securely with</span>
                        <span className='block text-blue-800'>FilePulse</span>
                    </h1>
                    <p className='mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
                        Upload , manage, and share your files securely. Accessible anywhere, anytime. 
                    </p>
                    <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                        <div className=" space-y-4 sm:space-y-0 sm:inline-grid sm:grid-cols-2 sm:gap-6">
                            {/* Get Started */}
                            <button
                            onClick={() => openSignUp()}
                            className="w-full flex items-center justify-center px-5 py-3 text-sm sm:text-base font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-600 md:py-4 md:text-lg md:px-8 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                            >
                            Get Started
                            </button>

                            {/* Sign In */}
                            <button
                            onClick={() => openSignIn()}
                            className="w-full flex items-center justify-center px-5 py-3 text-sm sm:text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-8 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                            >
                            Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className='aspect-w-16 rounded-lg shadow-xl overflow-hidden'>
                    <img src={dashboard} alt="filepulse dashboard" className='w-full h-full object-cover'/>
                </div>
                <div className='absolute inset-0 bg-gradient-to-t from-black opacity-10 rounded-lg'></div>
            </div>

            <div className="mt-8 text-center">
                <p className='mt-4 text-base text-gray-500'>
                    All your files are encrypted and stored securely with enterprise-grade security protocols.
                </p>
            </div>
        </div>
      </div>
    </>
  )
}

export default Hero
