import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Header from './Header';
import Hero from './Hero';
import Overview from './Overview';
import Brands from './Brands';
import Feature1 from './Feature1';
import Feature2 from './Feature2';
import Feature3 from './Feature3';
import Feature4 from './Feature4';
import Product from './Product';
import Pricing from './Pricing';
import Testimonials from './Testimonials';
import Cta from './Cta';
import Footer from './Footer';
import { ThemeProvider } from './ThemeContext';
const WelcomePage = () => {
  const { email, fullname, secret } = useParams();

  useEffect(() => {
    // Stockage des données dans le localStorage si les paramètres d'URL sont définis
    if (email && fullname && secret) {
      localStorage.setItem('user', JSON.stringify({ email, fullname, secret }));
    }
  }, [email, fullname, secret]);

  return (
    <div className='overflow-hidden'>
      <ThemeProvider>
        <Header />
        <Hero />
        <Overview />
        <Feature1 />
        <Feature2 />
        <Feature3 />
        <Feature4 />
        <Product />
        <Pricing />
        <Testimonials />
        <Cta />
        <Footer />
       </ThemeProvider>
      
    </div>
  );
};

export default WelcomePage;
