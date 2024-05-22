import React , { useEffect, useState } from "react";

import { product } from '../data';
import Cards from './Cards';  
import tr from "Services/tr";
import Cookies from "js-cookie";
const Product = () => {
 
  // destructure product data
  


  //pretitle , title , subtitle , btnLink
  
  const [title,settitle] = useState(product.title);
  const [subtitle,setsubtitle] = useState(product.subtitle);
  
 
  
   useEffect(() => {
     const langto = Cookies.get("to");
     // fonction multiThreads
     const translateData = async () => {
      if (langto != "fra" && langto) {
       
        settitle(await tr(title , "fra", langto))
        setsubtitle(await tr(subtitle , "fra", langto))
        
      }
     };
 
     translateData();
   }, []);
  return <section className=' dark:bg-black section'>
    <div className='container mx-auto '>
      {/* title subtitle */}
      <div className='flex flex-col items-center
       lg:flex-row mb-10 lg:mb-20 lg:ml-[90px]'>
        <div>
        <h2 className='dark:text-white font-bold text-[25px] mb-[20px] lg:mb-[0px] lg:section-title '
       
        > {title}
        </h2>
        <div className="w-[150px] h-[7px] my-[15px] bg-accent"></div>
       </div>
        <p className='lg:lead lg:max-w-[350px] dark:text-white lg:ml-[80px] lg:mt-[100px] '
         
        >{subtitle}
        </p>
      </div>
      {/* card */}
      <Cards />
    </div>
  </section>;
};

export default Product;
