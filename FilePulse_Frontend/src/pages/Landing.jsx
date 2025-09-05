import React, { useEffect } from 'react'
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Pricing from '../components/Landing/Pricing';
import Testimonials from '../components/Landing/Testimonials';
import CTA from '../components/Landing/CTA';
import Footer from '../components/Landing/Footer';
import { features , pricingPlans , testimonials } from '../assets/data';
import {useClerk , useUser} from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

const Landing = () => {

  const {openSignIn , openSignUp} = useClerk();
  const {isSignedIn} = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if(isSignedIn){
      navigate("/dashboard");
    }
  },[isSignedIn,navigate])

  return (
    <>
      <div className='landing-page bg-gradient-to-b from-gray-50 to-gray-100'>
        {/* Hero Section */}
        <Hero openSignIn={openSignIn} openSignUp={openSignUp}/>
        {/* Features Section */}
        <Features features={features}/>
        {/* Pricing Section */}
        <Pricing pricingPlans={pricingPlans} openSignUp={openSignUp}/>
        {/* Testimonials Section */}
        <Testimonials testimonials={testimonials}/>
        {/* CTA Section */}
        <CTA openSignUp={openSignUp}/>
        {/* Footer Section */}
        <Footer/>
      </div>
    </>
  )
}

export default Landing;
