import { SignedIn, useAuth, UserButton } from '@clerk/clerk-react';
import { Menu, Share2, Wallet, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import Sidemenu from './Sidemenu';
import CreditsDisplay from './CreditsDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCredits, updateCredits } from '../features/creditsSlice';

const Navbar = ({activeMenu}) => {

  const [openSideMenu, setOpenSideMenu] = useState(false);
  const credits = useSelector(state => state.credits.credits);
  const loading = useSelector(state => state.credits.loading);
  const error = useSelector(state => state.credits.error);
  const { getToken, isSignedIn } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSignedIn) {
      dispatch(fetchUserCredits({ getToken, isSignedIn }));
    }
  }, [dispatch, getToken, isSignedIn]);

  const handleCreditsUpdate = (newCredits) => {
    dispatch(updateCredits(newCredits));
  };

  return (
    <>
      <div className='flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30'>
        {/* Left Side - menu button and title */}
        <div className='flex items-center gap-5'>
          <button 
            onClick={() => setOpenSideMenu(!openSideMenu)}
            className='block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors'>
              {openSideMenu ? (
                <X className='text-xl'/>
              ) : (
                <Menu className='text-2xl'/>
              )}
          </button>

          <div className='flex items-center gap-2'>
              <Share2 className="text-blue-700"/>
              <span className='text-lg font-semibold text-black truncate'>
                File Pulse
              </span>
          </div>
        </div>

        {/* Right side - credits and user button */}
        <SignedIn>
          <div className='flex items-center gap-4'>
            <Link to="/subscriptions">
              <CreditsDisplay credits={credits}/>
            </Link>
            <div className='relative'>
                <UserButton/>
            </div>
          </div>
        </SignedIn>

        {/* Mobile side menu */}
        {openSideMenu && (
          <div className='fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20'>
            {/* Side menu bar  */}
            <Sidemenu activeMenu={activeMenu}/>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar
