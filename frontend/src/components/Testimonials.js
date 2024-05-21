import React , { useEffect, useState } from "react";

import { TestimonialsData } from '../data';
import ClientSlider from '../components/ClientSlider';
import tr from "Services/tr";
import Cookies from "js-cookie";
const Testimonials = () => {

 
  const { title ,clients} = TestimonialsData();
  console.log(clients);
  const [Titre,settitle] = useState(title);
   useEffect(() => {
     const langto = Cookies.get("to");
     // fonction multiThreads
     const translateData = async () => {
      if (langto != "fra" && langto) {
       
        settitle(await tr(Titre , "fra", langto))
        
      }
     };
 
     translateData();
   }, []);

  return (
    <section className='dark:bg-black section'>
      <div className='container mx-auto'>
        {/* title */}
        <h2 className='dark:text-white lg:title  text-[25px] font-bold font-Quicksand mb-10 lg:mb-20 text-center max-w-[920px] mx-auto'>
          {Titre}
        </h2>
        
        {/* slider */}
        <div   > 
          <ClientSlider clients ={clients} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;